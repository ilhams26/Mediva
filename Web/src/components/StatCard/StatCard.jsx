import './StatCard.css'
function StatCard(){
   return(
    <div className="stat-card">
        <div className="stat-card__icon">
            <p>💊</p>
        </div>
        <div >
            <p className="stat-card__title">Jumlah Obat</p>
            <h2 className="stat-card__value">7</h2>
        </div>
    </div>
   )
}

export default StatCard