import axios from  'axios'

describe('user resolvers',()=>{
    test('allUsers', async()=>{
        const response = await axios.post("http://localhost:8081/graphql",{
            query: `
                query {
                    allUsers {
                        id
                        username
                        email
                    }
                }
            `,
        })

        const {data} = response
        expect(data).toMatchObject({
            
        })
    })
})