# SvelteKit E-Commerce Application

This project is a modern e-commerce application built with **SvelteKit**, featuring a user-friendly interface, dynamic product listings, and secure API integration for handling orders, reviews, and cart functionalities. The project is designed with Human-Computer Interaction (HCI) principles in mind, ensuring an optimal user experience.

## Features

- Dynamic product listings with ratings and reviews

- Order tracking with a progress bar for statuses

- Secure login and token-based authentication

- API integration for fetching products, orders, and handling reviews

- Toast notifications for user feedback

- Adaptive design for mobile and desktop devices

- Environment configuration with `.env` support

## Tech Stack

- **Frontend**: SvelteKit

- **API**: REST APIs for products, orders, and reviews

- **Styling**: Tailwind CSS

- **Environment Management**: `.env` file for configurable URLs

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)

- npm or yarn

### Installation

1\. Clone the repository:

```bash

git clone https://github.com/your-repo/sveltekit-ecommerce.git

cd sveltekit-ecommerce

```

2\. Install dependencies:

```bash

npm install

```

3\. Create a `.env` file in the root directory:

```plaintext

VITE_API_BASE_URL=https://your-api-url.com/api

```

4\. Run the development server:

```bash

npm run dev

```

5\. Open your browser and navigate to `http://localhost:5173`.

## Folder Structure

```

src/

├── lib/

│   ├── api/        # API integration files (e.g., productsApi.ts, ratingsApi.ts)

│   ├── components/ # Reusable UI components (e.g., Navbar, StatusBar)

├── routes/         # Application pages

│   ├── +layout.svelte  # Global layout file

│   ├── +page.svelte    # Homepage

│   ├── products/       # Product pages

│   ├── orders/         # Order pages

├── app.css         # Global styles

```

## Environment Variables

| Key | Description | Example |

|-----|-------------|---------|

| `VITE_API_BASE_URL` | Base URL for API requests | `https://api.example.com/api` |

## Scripts

| Command | Description |

|---------|-------------|

| `npm run dev` | Start the development server |

| `npm run build` | Build the application for production |

| `npm run preview` | Preview the production build |

## API Endpoints

### Products

- **GET** `/products`: Fetch all products

- **GET** `/products/:id`: Fetch product details

### Orders

- **GET** `/orders`: Fetch all orders for the user

- **POST** `/orders`: Create a new order

### Ratings

- **POST** `/ratings/:productId`: Submit a product review

- **GET** `/ratings/:productId`: Fetch all reviews for a product

## Customizing the Project

- Update `src/lib/api/` to modify API integration

- Edit `src/routes/` to add or customize pages

- Adjust `src/app.css` or add more styles using Tailwind CSS

## Known Issues

1\. **Token Expiry**: Ensure valid tokens are used, as expired tokens result in authentication errors

2\. **API Connectivity**: Verify the `VITE_API_BASE_URL` in `.env` for API connection

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

## Acknowledgements

Special thanks to:

- **SvelteKit** for its modern and performant framework

- **Tailwind CSS** for simplifying responsive design

- All contributors for making this project better