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
        self.engine = create_engine("sqlite:///ev_chargers.sqlite")

    #################################################################

    def queryBarData(self, country):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text(f"""SELECT "City" as city, COUNT(*) AS city_count
                        FROM updated_file
                        WHERE "Country" = "{country}"
                        GROUP BY "City"
                        ORDER BY city_count DESC;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)

    def queryTableData(self, address_part):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT "Station ID" as sid, "Address" as address, "Longitude" as lng, "Latitude" as lat, "Charger Type" as ct, "Availability" as avail 
                        FROM updated_file
                        WHERE "Address" LIKE :address_filter;""")
        address_filter = f'%{address_part}%' 

        df = pd.read_sql(query, con=conn, params={"address_filter": address_filter})

        # Close the connection
        conn.close()
        return(df)

    def queryMapData(self, rating):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text(f"""SELECT
                    "Address" as address,
                    "Charger Type" as charger_type,
                    "Cost (USD/kWh)" as cost,
                    "Availability" as availability,
                    "Latitude" as latitude,
                    "Longitude" as longitude
                FROM
                    updated_file
                WHERE
                    "Reviews (Rating)" >= {rating}
                ORDER BY
                    "Reviews (Rating)" desc;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
