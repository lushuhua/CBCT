export default function reducer(state={
    detail:{},
    list: [],
    attrList:[]
}, action) {

    switch (action.type) {
        case "save": {
            return {...state, fetching: true}
        }
    }
    return state
}
