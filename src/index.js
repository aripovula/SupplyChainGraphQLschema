import {
    GraphQLServer
} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'


const companies = [{
    id: 'entity1',
    name: 'Assembler, Inc.',
    location: 'ACity, AB'
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
    name: 'Supplied Ltd.',
    location: 'DCity, AB'
}, {
    id: 'entity5',
    name: 'Fittings Co.',
    location: 'CCity, AB'

}]

const products = [{
    id: 'prodA',
    name: 'componentA',
    price: 20,
    producers: ['entity2', 'entity4']
}, {
    id: 'prodB',
    name: 'componentB',
    price: 30,
    producers: ['entity3', 'entity5']
}, {
    id: 'prodC',
    name: 'componentC',
    price: 40,
    producers: ['entity3', 'entity4']
}]

const orders = [{
    id: 'o10',
    volume: 100,
    time2deliver: 120,
    orderingCo: 'entity1',
    productOrdered: 'prodB',
    feedbackID: 'fo100'
}, {
    id: 'o11',
    volume: 200,
    time2deliver: 240,
    orderingCo: 'entity1',
    productOrdered: 'prodC',
    feedbackID: 'fo110'
}, {
    id: 'o12',
    volume: 100,
    time2deliver: 120,
    orderingCo: 'entity2',
    productOrdered: 'prodC',
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
        products(query: String): [Product!]!
        orders(query: String): [Order]
        feedbacks: [Feedback!]!
        company: Company!
        product: Product!
        order: Order!
    }

    type Mutation {
        createCompany(name: String!, location: String!): Company!
        createProduct(name: String!, price: Int!): Product!
        createOrder(orderingCo: String!, productOrdered: String!, volume: Int!, time2deliver: Int!): Order!
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
        price: Int!
        feedbacks: [Feedback!]!
    }

    type Order {
        id: ID!
        orderingCo: Company!
        productOrdered: Product!
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
        products(parent, args, ctx, info) {
            if (!args.query) {
                return products
            }

            return products.filter((product) => {
                return product.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        orders(parent, args, ctx, info) {
            console.log('in ABC args = ', args.query);
            console.log('orders', orders);

            if (!args.query) {
                console.log(' in !args.query NUL');
                return orders
            }

            return orders.filter((order) => {
                console.log('in ABC order = ', order);
                const isOrderingCoMatch = order.orderingCo.toLowerCase().includes(args.query.toLowerCase());
                const isOrderIdMatch = order.id.toLowerCase().includes(args.query.toLowerCase());
                const isProductMatch = order.productOrdered.toLowerCase().includes(args.query.toLowerCase());
                console.log('in ABC isOrderingCoMatch = ', isOrderingCoMatch, ' isProductMatch =', isProductMatch + ' isOrderIdMatch = ', isOrderIdMatch);
                return isOrderingCoMatch || isOrderIdMatch || isProductMatch;
            })
        },
        feedbacks(parent, args, ctx, info) {
            return feedbacks
        },
        company() {
            return {
                id: '123098',
                name: 'M Supplies',
                location: 'AnoVille'
            }
        },
        order() {
            return {
                id: '092',
                orderingCo: 'GraphQL 101',
                productOrdered: '1A',
                volume: 200,
                time2deliver: 120
            }
        }
    },
    Order: {
        orderingCo(parent, args, ctx, info) {
            return companies.find((company) => {
                console.log('company.id = ', company.id);
                return company.id === parent.orderingCo
            });
        },
        productOrdered(parent, args, ctx, info) {
            return products.find((product) => {
                console.log('company.id = ', product.id);
                return product.id === parent.productOrdered
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
        feedbacks(parent, args, ctx, info) {
            return feedbacks.filter((feedback) => {
                return feedback.author === parent.id
            })
        }
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