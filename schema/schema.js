const graphql = require("graphql");
const _ = require("lodash");


const {GraphQLObjectType,GraphQLString,GraphQLList} = graphql;

const {books,authors} = require("./dummyData");


const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:graphql.GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        authorId:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                // console.log(parent);
                return _.find(authors,{id:parent.authorId})
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:graphql.GraphQLID},
        name:{type:GraphQLString},
        age:{type:graphql.GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books,{authorId:parent.id});
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQuery',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:graphql.GraphQLID}},
            resolve(parent,args){
                //code to get data from db / other source
                // console.log(books)
                return _.find(books,{id:args.id})
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:graphql.GraphQLID}},
            resolve(parent,args){
                //code to get data from db / other source
                // console.log(authors)
                return _.find(authors,{id:args.id})
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parents,args){
                return books;
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parents,args){
                return authors;
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery
})