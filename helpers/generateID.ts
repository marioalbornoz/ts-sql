export const generateIdentifier = (name: string)=>{
    return `${name}-${Math.random().toString(36).substr(2, 9)}`
}