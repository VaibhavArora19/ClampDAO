const Navbar = () => {
    return (
        <nav className="flex justify-between w-11/12 m-auto">
            <div className="pt-2">
                <h1 className="text-3xl font-Lora cursor-pointer font-semibold">Clamp DAO</h1>
            </div>
            <div className="flex gap-10 pt-4 text-xl">
                <div>
                    <h2>Proposals</h2>
                </div>
                <div>
                    <h2>Profile</h2>
                </div>
            </div>
                <button className="bg-white text-black h-12 font-semibold w-44 rounded-3xl">Become member</button>
        </nav>
    )
};

export default Navbar;