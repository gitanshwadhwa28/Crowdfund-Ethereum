const routes = require('next-routes')();

routes.add('/campaigns/create', '/campaigns/create')
routes.add('/campaigns/:address', '/campaigns/show')
routes.add('/campaigns/:address/requests', '/campaigns/requests/index')
routes.add('/campaigns/:address/requests/create', '/campaigns/requests/create')



module.exports = routes

