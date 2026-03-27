import { useState } from "react";
import "../Styles/catalogo.css"; // ajusta la ruta según tu proyecto

type Autoparte = {
  aut_id: number;
  aut_nombre: string;
  aut_precio: number;
  aut_imagen: string;
  aut_cantidad: number;
  ofertaActiva?: boolean;
  precioOferta?: number;
  categoria?: string;
};

function Catalogo() {
  // 🔥 DATA SIMULADA (como si viniera del backend)
  const [autopartes] = useState<Autoparte[]>([
    {
      aut_id: 1,
      aut_nombre: "Filtro de aceite",
      aut_precio: 30,
      aut_imagen: "https://via.placeholder.com/150",
      aut_cantidad: 10,
      categoria: "Motor",
    },
    {
      aut_id: 2,
      aut_nombre: "Pastillas de freno",
      aut_precio: 80,
      aut_imagen: "https://via.placeholder.com/150",
      aut_cantidad: 5,
      ofertaActiva: true,
      precioOferta: 60,
      categoria: "Frenos",
    },
    {
      aut_id: 3,
      aut_nombre: "Batería 12V",
      aut_precio: 200,
      aut_imagen: "https://via.placeholder.com/150",
      aut_cantidad: 0,
      categoria: "Eléctrico",
    },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string[]>([]);

  // 🔍 FILTROS
  let filtrados = autopartes.filter((item) =>
    item.aut_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🧩 FILTRO POR CATEGORÍA
  if (categoriaSeleccionada.length > 0) {
    filtrados = filtrados.filter((item) =>
      categoriaSeleccionada.includes(item.categoria || "")
    );
  }

  // 🔃 ORDENAMIENTO
  if (orden === "asc") {
    filtrados.sort((a, b) => a.aut_precio - b.aut_precio);
  } else if (orden === "desc") {
    filtrados.sort((a, b) => b.aut_precio - a.aut_precio);
  }

  const toggleCategoria = (cat: string) => {
    if (categoriaSeleccionada.includes(cat)) {
      setCategoriaSeleccionada(categoriaSeleccionada.filter(c => c !== cat));
    } else {
      setCategoriaSeleccionada([...categoriaSeleccionada, cat]);
    }
  };

  const agregarAlCarrito = (id: number) => {
    alert("🛒 Agregado al carrito ID: " + id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Catálogo de Autopartes</h2>

      {/* 🔍 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar autoparte..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* 🔃 ORDEN */}
      <select onChange={(e) => setOrden(e.target.value)}>
        <option value="">Ordenar</option>
        <option value="asc">Menor a mayor</option>
        <option value="desc">Mayor a menor</option>
      </select>

      {/* 🧩 CATEGORÍAS */}
      <div style={{ marginTop: "10px" }}>
        <label>
          <input type="checkbox" onChange={() => toggleCategoria("Motor")} />
          Motor
        </label>

        <label>
          <input type="checkbox" onChange={() => toggleCategoria("Frenos")} />
          Frenos
        </label>

        <label>
          <input type="checkbox" onChange={() => toggleCategoria("Eléctrico")} />
          Eléctrico
        </label>
      </div>

      {/* 🛒 PRODUCTOS */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        marginTop: "20px"
      }}>
        {filtrados.length === 0 && <p>No se encontraron productos</p>}

        {filtrados.map((item) => (
          <div key={item.aut_id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            width: "220px",
            borderRadius: "10px"
          }}>
            <img src={item.aut_imagen} width="100%" />

            <h4>{item.aut_nombre}</h4>

            {item.ofertaActiva ? (
              <>
                <p style={{ textDecoration: "line-through" }}>
                  S/{item.aut_precio}
                </p>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  S/{item.precioOferta}
                </p>
              </>
            ) : (
              <p><strong>S/{item.aut_precio}</strong></p>
            )}

            <p>Stock: {item.aut_cantidad}</p>

            {item.aut_cantidad > 0 ? (
              <button onClick={() => agregarAlCarrito(item.aut_id)}>
                Añadir al carrito
              </button>
            ) : (
              <button disabled>AGOTADO</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;