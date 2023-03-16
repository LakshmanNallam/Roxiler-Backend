import fetch from "node-fetch";
import express from "express";
import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const app = express();

const dbPath = path.join(
  "/home/workspace/nodejs/coding-assignments/coding-assignment-2",
  "roxiler.db"
);

app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server Running at http://localhost:3002/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const findIndex = (month) => {
  const indexVal =
    [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "September",
      "october",
      "november",
      "december",
    ].indexOf(month.toLowerCase()) + 1;

  if (indexVal < 10) {
    return `0${indexVal}`;
  }
  return indexVal;
};

app.post("/initialize", async (request, response) => {
  const { api1 } = request.body;
  const response_fetched = await fetch(api1);
  const data = await response_fetched.json();
  console.log(data);
  try {
    data.map(async (eachItem) => {
      const query = `insert into ROXILER(id,title,price,description,category,sold,dateofsale)
          values (${eachItem.id},"${eachItem.title}",${eachItem.price},"${eachItem.description}","${eachItem.category}",${eachItem.sold},"${eachItem.dateOfSale}");`;
      const res = await db.run(query);
      console.log(res);
    });

    response.send({ success: "DATA ENTERED INTO DATABASE" });
  } catch (e) {
    response.send({ Error: `${e.message}` });
  }
});

app.get("/api1/:month", async (request, response) => {
  let { month } = request.params;
  month = findIndex(month);

  console.log(month);
  if (month < 1) {
    response.send({ FAILED: "INCORRECT MONTH" });
  } else {
    const quey = `select SUM(price) as total_sale_amount,COUNT(*) as no_of_sold_items,
  (select count(*) from ROXILER where strftime("%m",dateofsale)="${month}" AND sold=false) as no_of_unsold_items
   from ROXILER where strftime("%m",dateofsale)="${month}" AND sold=true;`;
    const res = await db.all(quey);
    response.send(res);
  }
});

app.get("/api2/:month", async (request, response) => {
  let { month } = request.params;
  month = findIndex(month);

  console.log(month);
  if (month < 1) {
    response.send({ FAILED: "INCORRECT MONTH" });
  } else {
    const list = [];

    const query = `select count() as "0-100"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 0 and 100`;
    const res1 = await db.get(query);
    list.push(res1);
    const query2 = `select count() as "101-200"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 101 and 200`;
    const res2 = await db.get(query2);
    list.push(res2);
    const query3 = `select count() as "201-301"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 201 and 300`;
    const res3 = await db.get(query3);
    list.push(res3);
    const query4 = `select count() as "301-400"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 301 and 400`;
    const res4 = await db.get(query4);
    const query5 = `select count() as "401-500"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 401 and 500`;
    list.push(await db.get(query5));
    const query6 = `select count() as "501-600"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 501 and 600`;
    list.push(await db.get(query6));

    const query7 = `select count() as "601-700"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 601 and 700`;
    list.push(await db.get(query7));

    const query8 = `select count() as "701-800"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 601 and 700`;
    list.push(await db.get(query8));

    const query9 = `select count() as "801-900"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 601 and 700`;
    list.push(await db.get(query9));

    const query10 = `select count() as "901 above"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price >=901`;
    list.push(await db.get(query10));
    response.send(list);
  }
});

app.get("/api3/:month", async (request, response) => {
  let { month } = request.params;
  month = findIndex(month);

  console.log(month);
  if (month < 1) {
    response.send({ FAILED: "INCORRECT MONTH" });
  } else {
    const query = `select category,COUNT() as no_of_items from ROXILER where strftime("%m",dateofsale)="${month}" group by category;`;
    const res = await db.all(query);
    response.send(res);
  }
});

app.get("/api4/:month", async (request, response) => {
  let { month } = request.params;
  month = findIndex(month);

  console.log(month);
  if (month < 1) {
    response.send({ FAILED: "INCORRECT MONTH" });
  } else {
    const final_list = {};
    const quey_api1 = `select SUM(price) as total_sale_amount,COUNT(*) as no_of_sold_items,
  (select count(*) from ROXILER where strftime("%m",dateofsale)="${month}" AND sold=false) as no_of_unsold_items
   from ROXILER where strftime("%m",dateofsale)="${month}" AND sold=true;`;
    const res_api1 = await db.all(quey_api1);

    final_list["api1"] = res_api1;

    //api2
    const list = [];
    const query = `select count() as "0-100"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 0 and 100`;
    const res1 = await db.get(query);
    list.push(res1);
    const query2 = `select count() as "101-200"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 101 and 200`;
    const res2 = await db.get(query2);
    list.push(res2);
    const query3 = `select count() as "201-301"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 201 and 300`;
    const res3 = await db.get(query3);
    list.push(res3);
    const query4 = `select count() as "301-400"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 301 and 400`;
    const res4 = await db.get(query4);
    const query5 = `select count() as "401-500"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 401 and 500`;
    list.push(await db.get(query5));
    const query6 = `select count() as "501-600"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 501 and 600`;
    list.push(await db.get(query6));

    const query7 = `select count() as "601-700"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 601 and 700`;
    list.push(await db.get(query7));

    const query8 = `select count() as "701-800"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 601 and 700`;
    list.push(await db.get(query8));

    const query9 = `select count() as "801-900"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price  between 601 and 700`;
    list.push(await db.get(query9));

    const query10 = `select count() as "901 above"
   from ROXILER where strftime("%m",dateofsale)="${month}" and price >=901`;
    list.push(await db.get(query10));

    final_list["api2"] = list;

    //api3
    const query_3 = `select category,COUNT() as no_of_items from ROXILER where strftime("%m",dateofsale)="${month}" group by category;`;
    const res_3 = await db.all(query_3);
    final_list["api3"] = res_3;
    response.send(final_list);
  }
});
