import StatCard from '../../components/dashboard/StatCard.jsx'
import{Pill,ShoppingCart, PackagePlus,TriangleAlert}from'lucide-react'
import Sidebar from '../../components/navigation/sidebar.jsx'
function StaffDashboard(){
    return (
        <>
        <Sidebar />
        <main className="min-h-screen p-6 pl-6 lg:ml-64 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Staff</h1>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"> 
            <StatCard
            title='Total Obat'
            value="128"
            icon={<Pill size={26}/>}
            />
            <StatCard
            title="Pesanan"
            value="0"
            icon={<ShoppingCart size={26}/>}
            />
            <StatCard
            title="Obat Masuk"
            value="50"
            icon={<PackagePlus size={26}/>}
            />
            <StatCard
            title="Obat Menipis"
            value="3"
            icon={<TriangleAlert size={26}/>}
            />
            </div>
        </main>
        </>
    )
}
export default StaffDashboard