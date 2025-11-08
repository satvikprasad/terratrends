import './App.css';

import { MapContainer, TileLayer } from 'react-leaflet'

import { Menubar, MenubarMenu, MenubarContent, MenubarItem, MenubarSeparator, MenubarTrigger, MenubarShortcut } from '@/components/ui/menubar';

function App() {
    return (
        <>
            <div className='absolute z-1000 left-1/2 -translate-x-1/2 top-6'>
                <div className='relative'>
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger>File</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>
                                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem>New Window</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Share</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Print</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
            <div className='min-h-screen min-w-screen'>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{
                    height: '100vh',
                    width: '100vw'
                }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </>
    )
}

export default App
