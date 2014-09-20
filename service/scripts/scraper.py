import requests, re, time, esprit, uuid
from bs4 import BeautifulSoup
from portality.core import app
from datetime import datetime

base_url = "http://world-nuclear.org/nucleardatabase/"
es_url = "http://localhost:9200/"
es_index = "wna"
es_conn = esprit.raw.Connection(es_url, es_index)

list_page = "service/scripts/WNA Reactor Database.html"
f = open(list_page)
listsoup = BeautifulSoup(f.read())
f.close()

table = listsoup.find(id="ctl00_MainContent_GridView1")
trs = table.find_all("tr")

stns = []
for tr in trs:
    if tr.get("align") : continue
    obj = {
        "wna_url" : None,
        "name" : None,
        "process" : None,
        "capacity_mwe_net" : None,
        "current_status" : None,
        "start_year" : None,
        "owner" : None,
        "country" : None
    }
    divs = tr.find_all("td")
    i = 0
    for d in divs:
        i += 1
        anchor = d.find("a")
        if anchor:
            obj["wna_url"] = base_url + anchor.get("href")
            obj["name"] = anchor.text
        if i == 2:
            obj["process"] = d.text
        elif i == 3:
            obj["capacity_mwe_net"] = d.text
        elif i == 4:
            obj["current_status"] = d.text
        elif i == 5:
            try:
                obj["start_year"] = int(d.text)
            except:
                pass
        elif i == 6:
            obj["owner"] = d.text
        elif i == 7:
            obj["country"] = d.text

    stns.append(obj)

def es_setup():
    mappings = {
        "reactor" : esprit.mappings.for_type(
            "reactor",
                esprit.mappings.properties(esprit.mappings.type_mapping("location", "geo_point")),
                esprit.mappings.dynamic_templates(
                [
                    esprit.mappings.EXACT
                ]
            )
        )
    }
    if not esprit.raw.index_exists(es_conn):
        print "Creating Index; host:" + str(es_conn.host) + " port:" + str(es_conn.port) + " db:" + str(es_conn.index)
        esprit.raw.create_index(es_conn)
    for key, mapping in mappings.iteritems():
        if not esprit.raw.has_mapping(es_conn, key):
            r = esprit.raw.put_mapping(es_conn, key, mapping)
            print key, r.status_code

def _normalise(label):
    return label.strip().lower().replace(" ", "_")

def _coerce(label, value):
    try:
        if label in ["criticality", "grid_connection", "shutdown", "commercial_operation"]:
            return datetime.strptime(value, "%d %B %Y").strftime("%Y-%m-%d")
        elif label in ["output_life", "capacity_net", "capacity_gross", "capacity_thermal", "net_capacity_(wna)", "capacity_factor_life"]:
            return float(value.strip().split(" ")[0])
    except:
        return None
    return value

def mine_page(obj):
    url = obj.get("wna_url")
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text)

    mainbox = soup.find(class_="mainBox")
    table = mainbox.find(class_="rdgrid")
    rows = table.find_all("tr")

    for r in rows:
        td = r.find("td")
        cs = td.get("colspan")
        if cs: continue
        divs = r.find_all("td")
        label = None
        value = None
        for d in divs:
            strong = d.find("strong")
            if strong: label = strong.text
            else: value = d.text
        label = _normalise(label)
        value = _coerce(label, value)
        if value is not None:
            obj[label] = value

    mframe = soup.find(id="map")
    murl = mframe.get("src")
    r = requests.get(murl)
    pattern = "var point = new google\.maps\.LatLng\((.+),(.+)\);"
    match = re.search(pattern, r.text)
    if match is not None:
        lat = match.group(1)
        lon = match.group(2)
        obj["location"] = {"lat" : lat, "lon" : lon}

    datatable = soup.find(id="tablestyle")
    dtrs = datatable.find_all("tr")
    ops = []
    for r in dtrs:
        if not r.get("align"): continue
        year = r.find("th")
        if year is None: continue

        op = {
            "year" : int(year.text),
            "reference_unit_power_mw" : None,
            "annual_output_gwh" : None,
            "annual_time_on_line_hours" : None,
            "capacity_factor_pc" : None,
            "operational_factor_pc" : None
        }

        divs = r.find_all("td")
        vals = [d.text for d in divs]
        op["reference_unit_power_mw"] = float(vals[0])
        op["annual_output_gwh"] = float(vals[1])
        op["annual_time_on_line_hours"] = int(vals[2])
        op["capacity_factor_pc"] = float(vals[3])
        op["operational_factor_pc"] = float(vals[4])
        ops.append(op)

    obj["operational_details"] = ops

es_setup()
total = len(stns)
limit = 700
i = 0
for stn in stns:
    if i > 0:
        time.sleep(5)
    print i, "of", total
    i += 1
    if i > limit:
        break
    mine_page(stn)
    stn["id"] = uuid.uuid4().hex
    esprit.raw.store(es_conn, "reactor", stn, id=stn["id"])










