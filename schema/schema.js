const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/Books");
const Author = require("../models/Authors");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// const {books,authors} = require("./dummyData");


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
                // return _.find(authors,{id:parent.authorId})
                console.log(parent.authorId)
                return Author.findById(parent.authorId);
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
                return Book.find({_id:parent.id});
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
                // return _.find(books,{id:args.id})
                return Book.findById({_id:args.id});
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:graphql.GraphQLID}},
            resolve(parent,args){
                //code to get data from db / other source
                // console.log(authors)
                // return _.find(authors,{id:args.id})
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parents,args){
                // return books;
                return Book.find();
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parents,args){
                // return authors;
                return Author.find();
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{
                    type: new GraphQLNonNull(GraphQLString)
                },
                age:{
                    type: new GraphQLNonNull(graphql.GraphQLInt)
                }
            },
            resolve(parent,args){
                let author = new Author({
                    name:args.name,
                    age:args.age
                });

                // saving author to the database
                return author.save()
                
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{
                    type:new GraphQLNonNull(GraphQLString)
                },
                genre:{
                    type:new GraphQLNonNull(GraphQLString)
                },
                authorId:{
                    type:new GraphQLNonNull(graphql.GraphQLID)
                }
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    genre:args.genre,
                    authorId:args.authorId
                });

                return book.save();
            }
        }
        
    }

})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
})