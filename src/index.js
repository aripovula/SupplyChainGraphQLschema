import {
    GraphQLServer
} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

const companies = [{
    id: 'entity0',
    name: 'Assembler, Inc.',
    creditRating: 'Abb',
    location: 'ACity, AB'
}, {
    id: 'entity1',
    name: 'Manufacturer, Corp.',
    creditRating: 'Abb',
    location: 'BCity, AB'
}, {
    id: 'entity2',
    name: 'Components, Co.',
    creditRating: 'Abb',
    location: 'BCity, AB'
}, {
    id: 'entity3',
    name: 'Parts Ltd.',
    creditRating: 'Abb',
    location: 'CCity, AB'
}, {
    id: 'entity4',
    name: 'Elements Ltd.',
    creditRating: 'Abb',
    location: 'DCity, AB'
}, {
    id: 'entity5',
    name: 'Fittings Co.',
    creditRating: 'Abb',
    location: 'CCity, AB'
}]

const blockchainBlocks = [{
    id: '0',
    marketplaceSignatureOnDeal: '000012345',
    previousHashOnDeal: '000000',
    hashOnDeal: '00001234',
    nonce: 54321
}, {
    id: '1',
    marketplaceSignatureOnDeal: '0000123456',
    previousHashOnDeal: '00001234',
    hashOnDeal: '00001234567890',
    nonce: 54321
}, {
    id: '2',
    marketplaceSignatureOnDeal: '000012345678',
    previousHashOnDeal: '00001234567890',
    hashOnDeal: '000012345',
    nonce: 54321
}];

const OptionStatus = {
    EFFECTIVE: 'EFFECTIVE',
    ON_HOLD_30SEC: 'ON_HOLD_30SEC',
    // USED: 'USED_DO_NOT_DELETE',
    // EXPIRED: 'EXPIRED'
}

const options = [{
    id: 'optBD',
    status: OptionStatus.EFFECTIVE,
    products: [{
            id: 'prodB',
            name: 'componentB',
            price: 20,
            offeredBy: 'entity4',
            available: 1000
        },
        {
            id: 'prodD',
            name: 'componentD',
            price: 15,
            offeredBy: 'entity5',
            available: 200
        }
    ]
}, {
    id: 'optAD',
    status: OptionStatus.EFFECTIVE,
    products: [{
            id: 'prodA',
            name: 'componentA',
            price: 10,
            offeredBy: 'entity2',
            available: 4250
        },
        {
            id: 'prodD',
            name: 'componentD',
            price: 16,
            offeredBy: 'entity3',
            available: 220
        }
    ]
}, {
    id: 'optCE',
    status: OptionStatus.ON_HOLD_30SEC,
    products: [{
            id: 'prodC',
            name: 'componentC',
            price: 4,
            offeredBy: 'entity3',
            available: 6400
        },
        {
            id: 'prodE',
            name: 'componentE',
            price: 2,
            offeredBy: 'entity5',
            available: 2380
        }
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
    optionDetails: 'optBD',
    feedbackID: 'fo100'
}, {
    id: 'o11',
    volume: 200,
    time2deliver: 240,
    status: OrderStatus.DELIVERED,
    orderingCo: 'entity1',
    optionDetails: 'optBD',
    feedbackID: 'fo110'
}, {
    id: 'o12',
    volume: 100,
    time2deliver: 120,
    status: OrderStatus.CONFIRMED_SHIPMENT_PENDING,
    orderingCo: 'entity2',
    optionDetails: 'optBD',
    feedbackID: 'fo120'
}]

const feedbacks = [{
    id: 'fo100',
    product: 'prodB',
    productRating: 4.5,
    orderNo: 'o10',
    deliveryRating: 4.6,
    author: 'entity1'
}, {
    id: 'fo110',
    product: 'prodC',
    productRating: null,
    orderNo: 'o11',
    deliveryRating: 4.8,
    author: 'entity1'
}, {
    id: 'fo120',
    product: 'prodA',
    productRating: 4.3,
    orderNo: 'o12',
    deliveryRating: null,
    author: 'entity1'
}, {
    id: 'fo121',
    product: 'prodD',
    productRating: 4.5,
    orderNo: 'o12',
    deliveryRating: 4.7,
    author: 'entity1'
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        companies(query: String): [Company!]!
        products(query: String): [Product!]!
        blockchainBlocks(query: String): [BlockchainBlock!]!
        options(query: String): [Option!]!
        orders(query: String): [Order]
        feedbacks(query: String): [Feedback!] !
    }

    type Mutation {
        createCompany(data: createCompanyInput!): Company!
        createOption(data: [createProductInput!]!): Option!
        deleteOption(id: ID!): Option!
        createOrder(data: createOrderInput!): Order!
        createFeedback(data: createFeedbackInput!): Feedback!
    }

    input createCompanyInput {
        name: String!
        location: String!
        creditRating: String!
    }

    input createProductInput {
        id: ID!
        name: String!
        price: Float!
        offeredBy: ID!
        available: Int!
        status: String
    }

    input createOrderInput {
        volume: Int!
        time2deliver: Int!
        status: String!
        orderingCo: String!
        optionDetails: ID!
        feedbackID: String!
    }

    input createFeedbackInput {
        productRating: Float!
        deliveryRating: Float!
        author: ID!
        orderNo: ID!
    }
    
    type Company {
        id: ID!
        name: String!
        location: String!
        creditRating: String!,
        orders: [Order!]!
        products: [Product!]!
        feedbacks: [Feedback!]!
    }

    type BlockchainBlock {
        id: ID!
        marketplaceSignatureOnDeal: String!
        previousHashOnDeal: String!
        hashOnDeal: String!
        nonce: Int!
    }

    type Product {
        id: ID!
        name: String!
        price: Float!
        offeredBy: Company!
        available: Int
        orderedVolume: Int
        productRating: Float
        status: String
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
        product: ID!
        orderNo: ID!
        deliveryRating: Float
        productRating: Float
        author: Company!
        order: Order!
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
        blockchainBlocks(parent, args, ctx, info) {
            if (!args.query) {
                return blockchainBlocks
            }

            return blockchainBlocks.filter((blockchainBlock) => {
                return blockchainBlock.id.toLowerCase().includes(args.query.toLowerCase())
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
                return isIdMatch || isStatusMatch || isProductsMatch;
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
            if (!args.query) {
                return feedbacks
            }

            return feedbacks.filter((feedback) => {
                const isAuthorMatch = feedback.author.toLowerCase().includes(args.query.toLowerCase());
                const isOrderIdMatch = feedback.orderNo.toLowerCase().includes(args.query.toLowerCase());
                const isProductMatch = feedback.product.toString().toLowerCase().includes(args.query.toLowerCase());
                return isAuthorMatch || isOrderIdMatch || isProductMatch;
            })
        }
    },
    Mutation: {
        createCompany(parent, args, ctx, info) {
            const nameTaken = companies.some((company) => company.name === args.data.name)

            if (nameTaken) {
                throw new Error('Name taken')
            }

            const company = {
                id: uuidv4(),
                ...args.data
            }

            companies.push(company)

            return company
        },
        createOption(parent, args, ctx, info) {

            const status = args.data[0].status;
            // Below code removes 'status' from all array items not to pollute DB.
            // if you query for 'status' after adding option 'null' will be shown. 
            // But 'status': null should not be added to DB. See result of log below.
            args.data.forEach((item) => {
                delete item.status
            });

            console.log('args.data - ', args.data);

            const option = {
                id: uuidv4(),
                status,
                products: args.data
            }

            options.push(option)

            return option
        },
        createOrder(parent, args, ctx, info) {
            const order = {
                id: uuidv4(),
                ...args.data
            }

            orders.push(order)

            return order
        },
        deleteOption(parent, args, ctx, info) {

            const optionIndex = options.findIndex((option) => option.id === args.id);

            if (optionIndex === -1) {
                throw new Error('Option not found')
            }
            if (options[optionIndex].status === "ON_HOLD_30SEC") {
                throw new Error('Can not delete now - someone is placing order. Try again in 30 seconds')
            }
            
            const deletedOption = options.splice(optionIndex, 1);

            return deletedOption[0];

        },
        createFeedback(parent, args, ctx, info) {
            const feedback = {
                id: uuidv4(),
                ...args.data
            }

            feedbacks.push(feedback)

            return feedback
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
            console.log('parent.optionDetails = ', parent.optionDetails);
            return options.find((option) => {
                console.log('option.id = ', option.id);
                return option.id === parent.optionDetails
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
        order(parent, args, ctx, info) {
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