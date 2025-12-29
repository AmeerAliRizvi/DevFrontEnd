import { Search } from "lucide-react/dist/cjs/lucide-react";

const SearchUsers = ()=>{

    return(
        <div className="flex">
            <h2 className="mx-10">Search</h2>
            <Search/>
            <input className="mx-2" placeholder="Input Username"/>
        </div>
    )

}
export default SearchUsers;