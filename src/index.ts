// Start by installing the project with `npm install`
// Initialize the project with `npx prisma init`
// Set your connection string in the `.env` file
// Set up your schema.prisma file
// Generate the client with `npx prisma generate` (optional)
// Update the database with with `npx prisma migrate dev` (That will also generate the client again)
// Run the app with `npm run start`

import promptSync from "prompt-sync";

// PrismaClient is imported as a singleton to make sure it is only created once.
// Reference: https://www.prisma.io/docs/concepts/components/prisma-client

import { prisma } from "./lib/prisma";
import { Movie, Genre } from "@prisma/client";
import { title } from "process";

const input = promptSync({ sigint: true });



async function addMovie(){

  // Expected:
  // 1. Prompt the user for movie title, year.
  // 2. Use Prisma client to create a new movie with the provided details.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  // 3. Print the created movie details.

  const MovieTitle = input("Enter a movie title: ")
  const Year = parseInt(input("Enter the release year: "))

  const newMovie = await prisma.movie.create({
     data: {
        title: MovieTitle,
        releaseYear: Year,
     }
});

  // Transactions and relationships (This we can add later on)
  //    Reference : https://www.prisma.io/docs/orm/prisma-client/queries/transactions
  // Expected:
  // 1.b Prompt the user for genre.
  // 2.b If the genre does not exist, create a new genre.
  // 3.b Ask the user if they want to want to add another genre to the movie.

  const Genre = input("Add a genre: ")

  const findMovie = await prisma.movie.findFirst({
    where: {
      title: MovieTitle
    }
  })

  const genreToMovie = await prisma.movie.update({
    where: {
      id: findMovie?.id
    },
    data: {
      genres: {
        connectOrCreate: {
          where: {
            name: Genre,
          },
          create:{
            name: Genre,
          }
        }
      }
    }
  })

  }



async function updateMovie() {
  // Expected:
  //  Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update

  // 1. Prompt the user for movie ID to update.
  const movieId = parseInt(input("Enter the ID of the movie you want to update: "))
   // 2. Prompt the user for new movie title, year.
  const newTitle = input("Enter the new title: ")
  const newYear = parseInt(input("Enter the new release year: "))

  // 3. Use Prisma client to update the movie with the provided ID with the new details.
  const updatedMovie = await prisma.movie.update ({
    where: {
      id: movieId,
    },
    data: {
      title: newTitle,
      releaseYear: newYear
    }
  })
  // 4. Print the updated movie details.
  console.log(updatedMovie)
}



async function deleteMovie() {
  // Expected:
  // Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete

  // 1. Prompt the user for movie ID to delete.
  const id = parseInt(input("Enter the ID of the movie you want to delete: "))

  // 2. Use Prisma client to delete the movie with the provided ID.
  
  try {
    const deletedMovie = await prisma.movie.delete ({
      where: {
        id,
      },
      
  }); 
  // 3. Print a message confirming the movie deletion.
  console.log(`The movie (ID: ${id}) was successfully deleted! `)
  } catch(error){
    console.log("Movie not deleted, make sure your ID is correct.")
  }

}


async function listMovies() {
  // Expected:
  // 1. Use Prisma client to fetch all movies.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 2. Include the genre details in the fetched movies.

const allMovies = await prisma.movie.findMany({
  take: 10,
    include: {
      genres: true
   },
})
console.log(allMovies)
// 3. Print the list of movies with their genres (take 10).
allMovies.forEach(movie => {
  console.log(`Movie: ${movie.title}`)
  movie.genres.forEach(genre => {
    console.log(`Genre: ${genre.name}`)
  })
  console.log(`-------`)
})


}

async function listMovieById() {
  // Expected:
  // 1. Prompt the user for movie ID to list.
  // 2. Use Prisma client to fetch the movie with the provided ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
  // 3. Include the genre details in the fetched movie.
  // 4. Print the movie details with its genre.

  const id = parseInt(input("Enter movie ID: "))

  const myMovie = await prisma.movie.findUnique({
      where: {
        id,
      }, 
      include: {
        genres: true
     },
  })

console.log(myMovie)

}



async function listMovieByGenre() {
  // Expected:
  // 1. Prompt the user for genre Name to list movies.
  // 2. Use Prisma client to fetch movies with the provided genre ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 3. Include the genre details in the fetched movies.
  // 4. Print the list of movies with the provided genre (take 10).

  const genre = input("Enter a genre: ")

  const moviesByGenre = await prisma.movie.findMany({
    take:10,
    where: {
      genres: {
        some: {
          name: genre,
        }
      } 
    }
  })

  console.log(moviesByGenre)

}

async function addGenre() {
  // Expected:
  // 1. Prompt the user for genre name.
  // 2. Use Prisma client to create a new genre with the provided name.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  // 3. Print the created genre details.

  try {
    
  const genre = input("Enter a genre name: ")

  const newGenre = await prisma.genre.create({
    data: {
      name: genre,
    }
  })
  console.log(`Genre added successfully. Name: ${newGenre.name} ID: ${newGenre.id}`)
  } catch (error) {
    console.log("Genre not added, make sure it doesnt already exists")
  }
}

async function main() {
  while (true) {
    try {
      console.clear();

      console.log("1. Add movie");
      console.log("2. Update movie");
      console.log("3. Delete movie");
      console.log("4. List movies");
      console.log("5. List movie by ID");
      console.log("6. List movies by genre");
      console.log("7. Add genre");
      console.log("0. Exit");

      const choice = input("Enter your choice: ");

      switch (choice) {
        case "1":
          await addMovie();
          break;
        case "2":
          await updateMovie();
          break;
        case "3":
          await deleteMovie();
          break;
        case "4":
          await listMovies();
          break;
        case "5":
          await listMovieById();
          break;
        case "6":
          await listMovieByGenre();
          break;
        case "7":
          await addGenre();
          break;
        case "0":
          return;
        default:
          console.log("Invalid choice");
      }

      void input("Press Enter to continue...");
    } catch (error) {
      console.error("An error occurred:", error);
      console.log("Please try again.");
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
