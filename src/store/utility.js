export const updateObject = (objectState, updatedObject) => {
    return {
        ...objectState,
        ...updatedObject
    }
}