const lists = [
    {
        id: 1,
        desc: ` In this code block, we've incorporated the entire code
                  repository. We have all the necessary files and lines of
                  code. A fabric token that included the "fabric App Id" in
                  the header and "app seceret" in the body was used to send a
                  request to use the fabric interface and receive a token in
                  response`
    },
    {
        id: 2,
        desc: ` The create order interface has a create Order Service module
                    that sends a complete product payload, including product
                    information, the owner short code, and the merchant app id.
                    It then returns an order id or prepaid id in response.`
    },
    {
        id: 3,
        desc: ` This interface need to construc a raw request`
    },
    {
        id: 5,
        desc: `You now have a token, which you can use to access the
                            create order interface and submit a create order.`,
        success: `You now have a token, which you can use to access the
                            create order interface and submit a create order.`,
        fail: `Waiting for valid token!`
    },
    {
        id: 6,
        success: `Now that a transaction has been created and an order ID
                      has been allocated, you are ready to move forward with the
                      payment. Go to the online checkout page and finish the
                      transaction.`,
        fail: `Waiting for valid Prepay Id!`
    },
    {
        id: 7,
        success: ` Success! Your raw request is legitimate, so we'll show you
                      our checkout so you can complete the transaction.`,
        fail: ` Fail! A checkout response with an empity order ID has been
                      created by you. So Return to step 1 and carefully complete
                      each step.`
    }
]

const getIntuition = (id) => {
    return lists.filter((list) => list.id === id)
}

export default getIntuition