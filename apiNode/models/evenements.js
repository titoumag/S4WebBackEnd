export const Evenement = (Sequelize,sequelize)=>{
    return sequelize.define('evenement', {
        idEvenement: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        libelleEvenement:{
            type: Sequelize.STRING,
            allowNull: false
        },
        heureDebut:{
            type: "TIMESTAMP",
            allowNull: false
        },
        heureFin:{
            type: "TIMESTAMP",
            allowNull: false
        }
    })
}