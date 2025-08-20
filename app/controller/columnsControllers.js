import Column from "../model/columnModel.js";
class ColumnsConytroller {
    async getColumns(req, res) {
        try {
            const columns = await Column.find().sort({ order: 1 });
            res.json(columns);
        } catch (error) {
            res.status(500).json({ message: "Error fetching columns", error: error.message });
        }
    };

    async createColumn(req, res) {
        try {
            const { name, order } = req.body;
            const column = new Column({ name, order });
            await column.save();
            res.status(201).json({ message: "Column created", column });
        } catch (error) {
            res.status(500).json({ message: "Error creating column", error: error.message });
        }
    };

    async updateColumn(req, res) {
        try {
            const { name, order } = req.body;

            const column = await Column.findById(req.params.id);
            if (!column) return res.status(404).json({ message: "Column not found" });

            column.name = name || column.name;
            column.order = order ?? column.order;

            await column.save();
            res.json({ message: "Column updated", column });
        } catch (error) {
            res.status(500).json({ message: "Error updating column", error: error.message });
        }
    };


    async deleteColumn(req, res) {
        try {
            const column = await Column.findById(req.params.id);
            if (!column) return res.status(404).json({ message: "Column not found" });

            await column.deleteOne();
            res.json({ message: "Column deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting column", error: error.message });
        }
    };


}

export default new ColumnsConytroller();