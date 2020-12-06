function format_key_value(key, val) {
    switch (key) {
        case "limit":
            return ``;
            break;
        case "page":
            return ``;
            break;
        case "starts_with":
            if (val !== '') return `title LIKE '${val.toUpperCase()}%'`;
            break;
        default:
            return `${key} = '${val}'`
    }
}

function from_http_to_sql(query) {

    let conditions = "";
    let order_by = "";
    let order_by_field = "id";
    let order_by_direction = "ASC";
    let limit = 10;
    let offset = "";

    if (Object.keys(query).length) {

        for (const property in query) {

            const formated_key_value = format_key_value(property,query[property]);

            if (property === "order_by") {

                order_by_field = query[property];

                if (query[property][0].startsWith('-')) {
                    order_by_field = order_by_field.split('-')[1];
                    order_by_direction = `DESC`
                } else {
                    order_by_direction = `ASC`
                }

            } else if ((formated_key_value !== undefined) || (property != "limit" && property != "medias" && property != "plan" && property != "matter_certificate" && property != "matter" && property != "illustration" && property != "page" && property != "export")) {

                if (formated_key_value !== "") {

                    if (conditions.includes("WHERE")) {
                        conditions += ` AND ${formated_key_value}`;
                    } else {
                        conditions += ` WHERE ${formated_key_value}`;
                    }
                }

            }
        }

        order_by = `ORDER BY ${order_by_field} ${order_by_direction}`;

        if (query.limit) {
            limit = query.limit;
        }

        let page = 1;
        if (query.page) page = query.page;
        offset += (page - 1) * limit;
        if (offset !== "") offset = "OFFSET " + offset

    }

    return { conditions, order_by, limit, offset };
}

module.exports = {from_http_to_sql,format_key_value};