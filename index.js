const express = require('express');
const cors = require('cors');
const route = require('./routers/index');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

route(app);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
