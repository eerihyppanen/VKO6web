document.addEventListener("DOMContentLoaded", (getData)

const getData = async => {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const res = await fetch(url, {
        method: "POST",
        headers: {"content-type": "aplication/json"},
        body: JSON.stringify()

    })
    if(!res.ok)  {
        return;
    }
    const data = await res.json()

    return data;


}
