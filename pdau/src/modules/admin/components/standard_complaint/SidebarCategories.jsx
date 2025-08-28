const SidebarCategories = ({ categorias }) => (
  <div className="bg-gray-900 text-white rounded-lg p-4 shadow flex flex-col items-center">
    <div className="font-bold mb-2 text-center w-full">Categorias</div>
    <div className="flex flex-wrap gap-2 justify-center w-full">
      {(categorias || []).map((cat) => (
        <span
          key={cat.id}
          className="bg-gray-300 text-black px-3 py-1 rounded-full font-semibold"
        >
          {cat.nombre}
        </span>
      ))}
    </div>
  </div>
);

export default SidebarCategories;