module.exports = function asyncFunction(routeHandler) {
    return async function(req, res, nxt) {
        try {
            await routeHandler(req, res, nxt); 
        } catch (err) {
            console.error("Error in asyncFunction:", err);
            nxt(err);
        }
    }
}
