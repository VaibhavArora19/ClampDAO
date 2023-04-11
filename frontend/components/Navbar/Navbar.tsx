import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
    const router = useRouter();
    return (
        <nav className="flex justify-between w-11/12 m-auto">
            <div className="pt-2">
                <h1 className="text-3xl font-Lora cursor-pointer font-semibold" onClick={() => {router.push('/')}}>Clamp DAO</h1>
            </div>
            <div className="flex gap-10 pt-4 text-xl">
                <div>
                    <Link href="/proposals"><h2 className="cursor-pointer">Proposals</h2></Link>
                </div>
                <div>
                    <Link href="/profile"><h2 className="cursor-pointer">Profile</h2></Link>
                </div>
                <div>
                    <Link href="/create"><h2 className='cursor-pointer'>Create</h2></Link>
                </div>
            </div>
            <div>
                {<ConnectButton accountStatus={"avatar"} chainStatus={"none"}/>}
                {
                    // isConnected ? <ConnectButton /> :  <button>Become member</button>
                }
            </div>
        </nav>
    )
};

export default Navbar;