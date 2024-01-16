import React, {Component} from 'react';
import axios from '../config/axios-config'; // Zaimportuj odpowiednią bibliotekę do komunikacji z API
import './BookList.css';
import {Link} from "react-router-dom";
import { withTranslation } from 'react-i18next';

class BookList extends Component {
    constructor() {
        super();
        this.state = {
            books: [],
            selectedBookId: '',
            editingId: null,
            isEditing: null,
            currentPage: 1,
            itemsPerPage: 10,
            newBook: {
                title: '',
                author: '',
                year: '',
            },
            isFormVisible: false,
        };
    }

    getCurrentBooks() {
        const {currentPage, itemsPerPage, books} = this.state;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return books.slice(indexOfFirstItem, indexOfLastItem);
    }

    componentDidMount() {
        // Pobierz listę książek z backendu po załadowaniu komponentu
        this.fetchBooks();
    }

    fetchBooks() {
        axios
            .get('/books')
            .then((response) => {
                console.log('Odpowiedź z serwera:', response.data);
                const sortedBooks = response.data.sort((a, b) => a.id - b.id);
                this.setState({books: sortedBooks});
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania danych:', error);
            });
    }

    handleDeleteClick(id) {
        this.setState({isFormVisible: false});
        // Usuń książkę o określonym ID
        axios
            .delete(`/books/${id}`)
            .then(() => {
                // Po usunięciu odśwież listę książek
                this.fetchBooks();
            })
            .catch((error) => {
                console.error('Błąd podczas usuwania danych:', error);
            });
    }

    handleEditClick(id) {
        const {books} = this.state;
        const bookToEdit = books.find((book) => book.id === id);
        // Ustaw ID książki, którą chcesz edytować
        if (bookToEdit) {
            this.setState({
                editingId: id,
                isEditing: id,
                isFormVisible: false,
                newBook: {
                    ...bookToEdit, // Skopiuj istniejące dane
                },
            });
        }
    }

    handleSaveClick(book) {
        // Zaktualizuj książkę o określonym ID
        axios
            .put(`/books/${book.id}`, book)
            .then(() => {
                this.fetchBooks();
                this.setState({editingId: null});
            })
            .catch((error) => {
                console.error('Błąd podczas zapisywania danych:', error);
            });
    }

    handleCancelClick() {
        // Anuluj edycję
        this.setState({editingId: null, isFormVisible: false});
    }

    handleInputChange(event, field) {
        // Obsługa zmiany wartości w formularzu
        this.setState({
            newBook: {
                ...this.state.newBook,
                [field]: event.target.value,
            },
        });
    }

    handleAddClick() {
        // Dodaj nową książkę
        axios
            .post('/books', this.state.newBook)
            .then(() => {
                // Po dodaniu odśwież listę książek
                this.fetchBooks();
                // Zresetuj formularz
                this.setState({
                    newBook: {
                        title: '',
                        author: '',
                        year: '',
                    },
                    isFormVisible: false,
                });
            })
            .catch((error) => {
                console.error('Błąd podczas dodawania danych:', error);
            });
    }

    renderPageNumbers() {
        const { t } = this.props;
        const {currentPage, itemsPerPage, books} = this.state;
        const totalPages = Math.ceil(books.length / itemsPerPage);

        return (
            <div>
                <center>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => this.setState({currentPage: currentPage - 1})}
                    >
                        &laquo; {t('previous')}
                    </button>
                    <span> {t('page')} {currentPage} {t('outOf')} {totalPages} </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => this.setState({currentPage: currentPage + 1})}
                    >
                        {t('next')} &raquo;
                    </button>
                </center>
            </div>
        );
    }

    render() {
        const { t } = this.props;
        const {editingId, newBook, isFormVisible} = this.state;
        const currentBooks = this.getCurrentBooks();

        return (
            <div>
                <Link to="/">
                    <button>{t('homepage')}</button>
                </Link>
                <h1>
                    <center>{t('bookList')}</center>
                </h1>
                <table>
                    <thead>
                    <tr>
                        <th>{t('id')}</th>
                        <th>{t('title')}</th>
                        <th>{t('author')}</th>
                        <th>{t('publicationYear')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentBooks.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>
                                {editingId === book.id ? (
                                    <input
                                        type="text"
                                        value={newBook.title}
                                        onChange={(e) => this.handleInputChange(e, 'title')}
                                    />
                                ) : (
                                    book.title
                                )}
                            </td>
                            <td>
                                {editingId === book.id ? (
                                    <input
                                        type="text"
                                        value={newBook.author}
                                        onChange={(e) => this.handleInputChange(e, 'author')}
                                    />
                                ) : (
                                    book.author
                                )}
                            </td>
                            <td>
                                {editingId === book.id ? (
                                    <input
                                        type="text"
                                        value={newBook.year}
                                        onChange={(e) => this.handleInputChange(e, 'year')}
                                    />
                                ) : (
                                    book.year
                                )}
                            </td>
                            <td>
                                {editingId === book.id ? (
                                    <>
                                        <button
                                            onClick={() => this.handleSaveClick(newBook)}
                                            className="save-button"
                                        >
                                            {t('save')}
                                        </button>
                                        <button
                                            onClick={() => this.handleCancelClick()}
                                            className="cancel-button"
                                        >
                                            {t('cancel')}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => this.handleEditClick(book.id)}
                                            className="edit-button"
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            onClick={() => this.handleDeleteClick(book.id)}
                                            className="delete-button"
                                        >
                                            {t('delete')}
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button
                    onClick={() =>
                        this.setState({
                            isFormVisible: true,
                            newBook: {
                                title: '',
                                author: '',
                                year: '',
                            },
                        },this.handleCancelClick())
                    }
                >
                    {t('createNewBook')}
                </button>
                {isFormVisible && (
                    <div>
                        <h2>{t('createNewBook')}</h2>
                        <div>
                            <label>{t('title')}:</label>
                            <input
                                type="text"
                                value={newBook.title}
                                onChange={(e) => this.handleInputChange(e, 'title')}
                            />

                            <label>{t('author')}:</label>
                            <input
                                type="text"
                                value={newBook.author}
                                onChange={(e) => this.handleInputChange(e, 'author')}
                            />

                            <label>{t('publicationYear')}:</label>
                            <input
                                type="text"
                                value={newBook.year}
                                onChange={(e) => this.handleInputChange(e, 'year')}
                            />
                        </div>
                        <button onClick={() => this.handleAddClick()}>{t('add')}</button>
                        <button onClick={() => this.handleCancelClick()} className="cancel-button">
                        {t('cancel')}
                        </button>
                    </div>
                )}
                <div className="pagination">
                    {this.renderPageNumbers()}
                </div>
            </div>
        );
    }
}

export default withTranslation()(BookList);
