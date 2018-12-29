import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

const companies = [{
    id: 'entity0',
    name: 'Assembler, Inc.',
    location: 'ACity, AB'
}, {
    id: 'entity1',
    name: 'Manufacturer, Corp.',
    location: 'BCity, AB'
}, {
    id: 'entity2',
    name: 'Components, Co.',
    location: 'BCity, AB'
}, {
    id: 'entity3',
    name: 'Parts Ltd.',
    location: 'CCity, AB'
}, {
    id: 'entity4',
    name: 'Elements Ltd.',
    location: 'DCity, AB'
}, {
    id: 'entity5',
    name: 'Fittings Co.',
    location: 'CCity, AB'

}]

const OptionStatus = {
    EFFECTIVE: 'EFFECTIVE',
    USED: 'USED_DO_NOT_DELETE',
    EXPIRED: 'EXPIRED'
}

const options = [{
        id: 'optBD',
        status: OptionStatus.EFFECTIVE,
        products: [
            { id: 'prodB', name: 'componentB', price: 20, offeredBy: 'entity4', available: 1000 },
            { id: 'prodD', name: 'componentD', price: 15, offeredBy: 'entity5', available: 200 }
        ]
    }, {
        id: 'optAD',
        status: OptionStatus.EFFECTIVE,
        products: [
            { id: 'prodA', name: 'componentA', price: 10, offeredBy: 'entity2', available: 4250 },
            { id: 'prodD', name: 'componentD', price: 16, offeredBy: 'entity3', available: 220 }
        ]
    }, {
        id: 'optCE',
        status: OptionStatus.EXPIRED,
        products: [
            { id: 'prodC', name: 'componentC', price: 4, offeredBy: 'entity3', available: 6400 },
            { id: 'prodE', name: 'componentE', price: 2, offeredBy: 'entity5', available: 2380 }
        ]
    }];

const OrderStatus = {
    INFO_REQUESTED: 'INFO_REQUESTED',
    PURCHASE_APPROVAL_PENDING: 'PURCHASE_APPROVAL_PENDING',
    CONFIRMED_SHIPMENT_PENDING: 'CONFIRMED_SHIPMENT_PENDING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    REJECTED: 'REJECTED'
}

const orders = [{
    id: 'o10',
    volume: 100,
    time2deliver: 120,
    status: OrderStatus.INFO_REQUESTED,
    orderingCo: 'entity1',
    optionDetails: options[0],
    feedbackID: 'fo100'
}, {
    id: 'o11',
    volume: 200,
    time2deliver: 240,
    status: OrderStatus.DELIVERED,
    orderingCo: 'entity1',
    optionDetails: options[1],
    feedbackID: 'fo110'
}, {
    id: 'o12',
    volume: 100,
    time2deliver: 120,
    status: OrderStatus.CONFIRMED_SHIPMENT_PENDING,
    orderingCo: 'entity2',
    optionDetails: options[2],
    feedbackID: 'fo120'
}]

const feedbacks = [{
    id: 'fo100',
    productRating: 4.5,
    deliveryRating: 4.6,
    author: 'entity1',
    orderNo: 'o10'
}, {
    id: 'fo110',
    productRating: 4.6,
    deliveryRating: 4.8,
    author: 'entity1',
    orderNo: 'o11'
}, {
    id: 'fo120',
    productRating: 4.3,
    deliveryRating: 4.2,
    author: 'entity1',
    orderNo: 'o12'
}, {
    id: 'fo121',
    productRating: 4.5,
    deliveryRating: 4.7,
    author: 'entity1',
    orderNo: 'o12'
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        companies(query: String): [Company!]!
        options(query: String): [Option!]!
        orders(query: String): [Order]
        feedbacks: [Feedback!]!
    }

    type Mutation {
        createCompany(name: String!, location: String!): Company!
        createFeedback(productRating: Float!, deliveryRating: Float!, author: ID!, orderNo: ID!): Feedback!
    }

    type Company {
        id: ID!
        name: String!
        location: String!
        orders: [Order!]!
        products: [Product!]!
        feedbacks: [Feedback!]!
    }

    type Product {
        id: ID!
        name: String!
        price: Float!
        offeredBy: Company!
        available: Int
        orderedVolume: Int
    }

    type Option {
        id: ID!
        status: String!
        products: [Product!]!
    }

    type Order {
        id: ID!
        orderingCo: Company!
        optionDetails: Option!
        status: String!,
        volume: Int!
        time2deliver: Int!
        feedbacks: [Feedback!]!
    }

    type Feedback {
        id: ID!
        productRating: Float!
        deliveryRating: Float!
        author: Company!
        orderNo: Order!
    }
`

// Resolvers
const resolvers = {
    Query: {
        companies(parent, args, ctx, info) {
            if (!args.query) {
                return companies
            }

            return companies.filter((company) => {
                return company.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        options(parent, args, ctx, info) {
            if (!args.query) {
                return options
            }

            return options.filter((option) => {
                const isIdMatch = option.id.toLowerCase().includes(args.query.toLowerCase());
                const isStatusMatch = option.status.toLowerCase().includes(args.query.toLowerCase());
                const isProductsMatch = option.products.toString().toLowerCase().includes(args.query.toLowerCase());
                return isIdMatch || isStatusMatch || isProducstMatch;
            })
        },
        orders(parent, args, ctx, info) {
            if (!args.query) {
                return orders
            }

            return orders.filter((order) => {
                const isOrderingCoMatch = order.orderingCo.toLowerCase().includes(args.query.toLowerCase());
                const isOrderIdMatch = order.id.toLowerCase().includes(args.query.toLowerCase());
                const isProductMatch = order.optionDetails.toString().toLowerCase().includes(args.query.toLowerCase());
                return isOrderingCoMatch || isOrderIdMatch || isProductMatch;
            })
        },
        feedbacks(parent, args, ctx, info) {
            return feedbacks
        }
    },

    Order: {
        orderingCo(parent, args, ctx, info) {
            return companies.find((company) => {
                console.log('company.id = ', company.id);
                return company.id === parent.orderingCo
            });
        },
        optionDetails(parent, args, ctx, info) {
            console.log('parent.optionDetails = ', parent.optionDetails.id);
            return options.find((option) => {
                console.log('option.id = ', option.id);
                return option.id === parent.optionDetails.id
            });
        },
        feedbacks(parent, args, ctx, info) {
            return feedbacks.filter((feedback) => {
                return feedback.orderNo === parent.id
            })
        }
    },
    Feedback: {
        author(parent, args, ctx, info) {
            return companies.find((company) => {
                return company.id === parent.author
            })
        },
        orderNo(parent, args, ctx, info) {
            return orders.find((order) => {
                return order.id === parent.orderNo
            })
        }
    },
    Product: {
        offeredBy(parent, args, ctx, info) {
            return companies.find((company) => {
                return company.id === parent.offeredBy
            })
        }
    },
    Option: {
        // products(parent, args, ctx, info) {
        //     return optionDetails.products.filter((product) => {
        //         console.log('product ID ID', product.id);
                
        //         return product.id.toString().includes(parent.id);
        //     })
        // }
    },
    Company: {
        orders(parent, args, ctx, info) {
            return orders.filter((order) => {
                return order.author === parent.id
            })
        },
        products(parent, args, ctx, info) {
            return products.filter((product) => {
                return product.producers.toString().includes(parent.id);
            })
        },
        feedbacks(parent, args, ctx, info) {
            return feedbacks.filter((feedback) => {
                return feedback.author === parent.id
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})