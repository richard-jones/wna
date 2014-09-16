from setuptools import setup, find_packages

setup(
    name = 'WNA',
    version = '1.0.0',
    packages = find_packages(),
    install_requires = [
        "portality==2.0.0",
        "esprit",
        "Flask",
        "beautifulsoup4"
    ],
    url = 'http://cottagelabs.com/',
    author = 'Cottage Labs',
    author_email = 'us@cottagelabs.com',
    description = 'World Nuclear Association demo reactor database',
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: Copyheart',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
)