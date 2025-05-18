import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Navbar as BootstrapNavbar,
  Container,
  Form,
  Button,
  Nav,
  Dropdown,
  InputGroup
} from "react-bootstrap";

function Navbar({ loggedIn, setLoggedIn, onAddClick }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3001/whoim", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmail(res.data.email))
      .catch((err) => {
        console.error("Nepavyko gauti naudotojo info:", err);
        localStorage.removeItem("token");
        setLoggedIn(false);
      });
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      {/* Viršutinis navigacijos blokas */}
      <BootstrapNavbar expand="lg" bg="light" className="shadow-sm">
        <Container className="align-items-center">
          <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
            <img
            src="/logo-krakatuzo.png"
            alt="KRAKATŪZO"
            height="36"
            className="me-2"
            />
          </BootstrapNavbar.Brand>

          {/* Paieška */}
          <Form className="mx-auto d-none d-lg-block w-50">
            <InputGroup>
              <Form.Control type="text" placeholder="Ieškoti prekių..." />
              <Button variant="outline-secondary">
                <i className="bi bi-search" />
              </Button>
            </InputGroup>
          </Form>

          <div className="d-flex gap-2 align-items-center">
            {loggedIn ? (
              <>
                <Button size="sm" variant="success" onClick={onAddClick}>
                  + Pridėti
                </Button>

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    size="sm"
                    id="user-dropdown"
                  >
                    {email}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/my-products">
                      Mano prekės
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      className="text-danger"
                      onClick={handleLogout}
                    >
                      Atsijungti
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button as={Link} to="/register" variant="outline-secondary" size="sm">
                  Registruotis
                </Button>
                <Button as={Link} to="/login" variant="outline-primary" size="sm">
                  Prisijungti
                </Button>
              </>
            )}
          </div>
        </Container>
      </BootstrapNavbar>

      {/* Apatinė kategorijų juosta */}
      <Nav variant="tabs" className="justify-content-center border-top border-bottom py-2 bg-white">
        {["Daržovės", "Vaisiai", "Gyvulininkystė", "Namų gamybos", "Paslaugos", "Kita"].map((cat) => (
          <Nav.Item key={cat}>
            <Nav.Link href="#">{cat}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </>
  );
}

export default Navbar;
