const requestBodyTemplate = {
    "query": [
        {
            "code": "Vuosi",
            "selection": {
                "filter": "item",
                "values": [
                    "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
                    "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019",
                    "2020", "2021"
                ]
            }
        },
        {
            "code": "Alue",
            "selection": {
                "filter": "item",
                "values": ["SSS"]
            }
        },
        {
            "code": "Tiedot",
            "selection": {
                "filter": "item",
                "values": ["vaesto"]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
};

document.addEventListener("DOMContentLoaded", async () => {

    let municipalityCodes = {};

    const getMunicipalityCodes = async () => {
        const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

        const res = await fetch(url);
        if (!res.ok) {
            console.error("Failed to fetch municipality codes");
            return;
        }
        const data = await res.json();
        const codes = data.variables[1].values;
        const names = data.variables[1].valueTexts;

        codes.forEach((code, index) => {
            municipalityCodes[names[index].toLowerCase()] = code;
        });
    };


    const getData = async (areaCode)=> {
        const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

        const requestBody = JSON.parse(JSON.stringify(requestBodyTemplate));
        requestBody.query[1].selection.values = [areaCode];

        try{

        const res = await fetch(url, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(requestBody)

        });
        if(!res.ok)  {
            console.error("Failed to fetch data, status:", res.status);//too much debugging to console again:/
            return;
        }
        const data = await res.json()
        //console.log(data);
        return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        
        


    };




    const buildChart = async (areaCode) => {
        const data = await getData(areaCode);
        if (!data || !data.dimension) {
            console.error("Invalid data received");
            return;
        }
        //console.log(data);

        
        const labels = Object.values(data.dimension.Vuosi.category.label);
        const values = data.value;
        
        
        console.log(labels)
        console.log(values)


        

        const chartData = {
            labels: labels,
            datasets:[
                {
                    name: "Population", 
                    values: values
                }
            ]
        };

        const chart = new frappe.Chart("#chart", {
            title: "Population Data from 2000 to 2021",
            data: chartData,
            type: "line",
            height: 450,
            colors: ['#eb5146'],
           

        });



    };

    document.getElementById("submit-data").addEventListener("click", async () => {
        const inputArea = document.getElementById("input-area").value.trim().toLowerCase();
        if (inputArea && municipalityCodes[inputArea]) {
            buildChart(municipalityCodes[inputArea]);
        } else {
            console.error("Invalid municipality name");
        }
    });

    await getMunicipalityCodes();


    buildChart("SSS");

    
});

