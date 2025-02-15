from sqlalchemy import create_engine, text

import pandas as pd 

# Define the SQLHelper Class
# PURPOSE: Deal with all of the database logic

class SQLHelper():

    # Initialize PARAMETERS/VARIABLES

    #################################################
    # Database Setup
    #################################################
    def __init__(self):
        self.engine = create_engine("sqlite:///ev_charging_stations.sqlite")
  

    #################################################################

    def queryBarData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT "Installation Year", COUNT(*) AS station_count
                    FROM ev_charging_stations
                    GROUP BY "Installation Year"
                    ORDER BY "Installation Year";
""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    def queryTableData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""
         SELECT
        "Latitude",
        "Longitude",
        "Charger Type",
        "Address",
        "Parking Spots"
    FROM
        ev_charging_stations  
    GROUP BY
        Latitude,
        Longitude,
        "Charger Type",
        Address,
        "Parking Spots"
""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    def queryMapData(self, min_installation_year):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text(f"""
    SELECT
        "Latitude",
        "Longitude",
        "Charger Type",
        "Address",
        "Parking Spots",
        "Installation Year"
    FROM
        ev_charging_stations
    WHERE
        "Installation Year" >= {min_installation_year}
    GROUP BY
        Latitude,
        Longitude,
        "Charger Type",
        Address,
        "Parking Spots",
        "Installation Year"
""")

        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    