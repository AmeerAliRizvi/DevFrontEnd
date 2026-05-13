import { Search } from "lucide-react/dist/cjs/lucide-react";

const SearchUsers = ()=>{

    return(
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex gap-3 items-center">
            <h2 className="text-sm md:text-base">Search</h2>
            <Search className="w-4 h-4 md:w-5 md:h-5"/>
            <input className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base" placeholder="Input Username"/>
        </div>
    )

}
export default SearchUsers;