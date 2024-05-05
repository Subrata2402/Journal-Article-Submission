import React, { useEffect, useState } from "react";
// import { MdAdminPanelSettings } from "react-icons/md";
import { GrView } from "react-icons/gr";
import "./editor.css";
import { useAuth } from "../../store/AuthContext";
import Article from "../../services/articleService";
import { toast } from "react-toastify";
import Reviewer from "../../services/reviewerService";
// import EditorArticleView from "./EditorArticleView";
// import { Button } from "react-bootstrap";
import Confirmation from "../../utils/Confirmation";
import { useJournal } from "../../store/JournalContext";
import { Link } from "react-router-dom";

function AssignReviewer() {
    const { token } = useAuth();
    const { articles, setArticles, getJournalArticles, journalData } = useJournal();
    // const [articles, setArticles] = useState([]);
    const [article, setArticle] = useState(false);
    const [reviewers, setReviewers] = useState([]);
    const [tempReviewers, setTempReviewers] = useState([]);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    // const [modalShow, setModalShow] = useState(false);
    const [search, setSearch] = useState("");
    const [cnfModalShow, setCnfModalShow] = useState(false);
    const [rcnfModalShow, setRcnfModalShow] = useState(false);

    /**
     * Handles the submission of the selected reviewers.
     * @param {Event} e - The event object.
     * @returns {Promise<void>} - A promise that resolves when the reviewers are updated.
     */
    const handleSubmitReviewer = async () => {
        // Assign the selected reviewers to the article
        if (selectedReviewers.length === 0) {
            toast.error("Please select at least one reviewer");
            return;
        }
        const existingReviewers = article.reviewers.map(reviewer => reviewer.email);
        const newReviewers = selectedReviewers.filter(reviewer => !existingReviewers.includes(reviewer));
        newReviewers.forEach(reviewer => {
            article.reviewers.push({ email: reviewer });
        });
        // Update the article with the selected reviewers
        const response = await Article.updateArticle(article, token);
        // If the update is successful, show a success message
        if (response.success) {
            toast.success("Reviewers updated successfully");
        } else {
            // If the update is not successful, show an error message
            toast.error(response.message);
        }
    }

    /**
     * Handles the selection of a reviewer.
     * @param {Event} e - The event object.
     */
    const handleSelectReviewer = (e) => {
        // Check if the reviewer is selected
        const selectedReviewer = e.target.checked;

        // Find the email of the selected reviewer
        const email = reviewers.find(reviewer => reviewer._id === e.target.id).email;

        if (selectedReviewers.length >= 3 && selectedReviewer) {
            toast.error("You can only select 3 reviewers");
            e.target.checked = false;
            return;
        }

        // If the reviewer is selected, add the reviewer's email to the selectedReviewers array
        if (selectedReviewer) {
            selectedReviewers.push(email);
        } else {
            // If the reviewer is deselected, remove the reviewer's email from the selectedReviewers array
            const index = selectedReviewers.indexOf(email);
            selectedReviewers.splice(index, 1);
        }
    }

    /**
     * Handles the submission of the article status update.
     * @param {Event} e - The event object.
     * @returns {Promise<void>} - A promise that resolves when the status update is handled.
     */
    const handleSubmitStatus = async () => {
        // Check if the status is selected
        if (article.status === "select-status") {
            return toast.error("Please select a status");
        }
        // Update the article status with the provided token
        if (["accepted", "rejected"].includes(article.status)) {
            article.finalStatus = article.status;
        } else {
            article.finalStatus = "";
        }
        const response = await Article.updateArticle(article, token);
        if (response.success) {
            toast.success("Status updated successfully");
            getJournalArticles(journalData);
        } else {
            toast.error(response.message);
        }
    };

    /**
     * Fetches the list of reviewers.
     * @returns {Promise<void>} A Promise that resolves when the list of reviewers is fetched.
     */
    const getReviewers = async () => {
        // To get the list of reviewers
        const response = await Reviewer.getReviewerList(token);
        if (response.success) {
            setReviewers(response.data);
            setTempReviewers(response.data);
        }
    }

    useEffect(() => {
        // Call the function to get the list of reviewers
        getReviewers();
    }, [])

    /**
     * Handles the click event when a row is clicked.
     * Toggles the selection state of the clicked row and updates the article state accordingly.
     * @param {Event} event - The click event object.
     */
    const handleClick = (event) => {
        // Retrieve the ID of the clicked row
        if (['BUTTON', 'path', 'svg'].includes(event.target.tagName)) return;
        const selectedRowId = event.currentTarget.id;
        // Toggle the selection state of the clicked row
        const updatedArticles = articles.map(article => {
            if (article._id === selectedRowId) {
                return { ...article, isSelected: !article.isSelected };
            } else {
                return { ...article, isSelected: false };
            }
        });
        // If the clicked row is selected, set the article state to the selected article
        if (updatedArticles.find((article) => article._id === selectedRowId).isSelected) {
            const selectedArticle = updatedArticles.find((article) => article._id === selectedRowId);
            setArticle(selectedArticle);
            const filteredReviewers = tempReviewers.filter(reviewer => !selectedArticle.reviewers.some(r => r.email === reviewer.email));
            setReviewers(filteredReviewers);
            setSelectedReviewers(selectedArticle.reviewers.map(reviewer => reviewer.email));
        } else {
            // If the clicked row is deselected, set the article state to false
            setArticle(false);
        }

        // Update the state with the modified articles array
        setArticles(updatedArticles);
        const authorsInp = document.querySelectorAll('.check-author-inp');
        authorsInp.forEach(inp => inp.checked = false);
    };


    const statusChange = (e) => {
        setArticle({ ...article, status: e.target.value });
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        const searchValue = e.target.value.toLowerCase();
        const filteredReviewers = tempReviewers.filter(reviewer => {
            return reviewer.firstName.toLowerCase().includes(searchValue) || reviewer.lastName.toLowerCase().includes(searchValue) || reviewer.affiliation.toLowerCase().includes(searchValue);
        });
        setReviewers(filteredReviewers);
    }

    return (
        <section className="editor table-responsive">
            <div className="editor-container">
                <div className="editor-form">
                    <div className="row m-0 p-0">
                        {/* Editor journal-title */}
                        <div className="col-md-12">
                            <h2 className="text-center fw-bold">Assign Reviewer</h2>
                            <hr />
                        </div>
                        {
                            articles.length === 0 ? <h2 className='fw-bold'>There are no articles...</h2> :
                                <div className={`col-md-9 table-responsive ${!article && 'col-md-12'}`}>
                                    <table className="table table-striped table-bordered text-center">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th style={{ width: "45rem" }}>Title</th>
                                                <th>Submission Date</th>
                                                <th>View details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((article, index) => (
                                                <tr key={index} onClick={handleClick} id={article._id} className={article.isSelected ? "table-primary" : ""}>
                                                    <th>{index + 1}</th>
                                                    <td>
                                                        <div className="txt-container text-start" style={{ width: "30rem" }}>
                                                            {article.title}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {new Date(article.createdAt).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        {/* <Button variant="outline-primary" onClick={() => setModalShow(prevState => ({ ...prevState, [index]: true }))}>
                                                            <GrView />
                                                        </Button>
                                                        <EditorArticleView
                                                            show={modalShow[index]}
                                                            handleClose={() => setModalShow(prevState => ({ ...prevState, [index]: false }))}
                                                            article={article}
                                                        /> */}
                                                        <Link to={`/dashboard/view-journal-article/${article._id}`} state={{ isEditor: true }} className="btn btn-outline-primary">
                                                            <GrView />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                        }

                        {article && <div className='col-md-3'>
                            {/* Status*/}
                            <div className="card status">
                                <div className="card-title">
                                    <h5>Status</h5>
                                </div>
                                <div className="card-body d-flex flex-column justify-content-around">
                                    <select
                                        name="status"
                                        id="status"
                                        className="form-select"
                                        value={["accepted", "rejected", "under review"].includes(article.status) ? article.status : "select-status"} onChange={statusChange}
                                    >
                                        <option value="select-status" disabled>Select Status</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="under review">Under Review</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setCnfModalShow(true)}
                                        className="btn btn-dark btn-lg w-100 mt-3"
                                    >Update</button>

                                    <Confirmation
                                        show={cnfModalShow}
                                        handleClose={() => setCnfModalShow(false)}
                                        onConfirm={handleSubmitStatus}
                                        title="Update Status"
                                        message={`<p><strong class="text-capitalize d-block mb-2">Status: ${article.status}</strong>Are you sure you want to update the status?</p>`}
                                    />
                                </div>
                            </div>

                            {/* Reviewer list */}
                            {article.reviewers.length < 3 && <form className="card reviewer-list mt-2" id="submit">
                                <div className="card-title">
                                    <h5>Reviewers</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div
                                        className="search-author"
                                        style={{ marginBottom: ".2rem" }}
                                    >
                                        <input
                                            type="search"
                                            name="author-search"
                                            id="author-search"
                                            placeholder="Search Reviewer..."
                                            className="form-control"
                                            aria-label="Search"
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <ul className="p-2 ">
                                        {reviewers.map((reviewer, index) => (
                                            <label htmlFor={reviewer._id} className="w-100" key={index}>
                                                <li className="m-0 d-flex justify-content-between align-items-center author-items">
                                                    <label htmlFor={reviewer._id}>
                                                        {reviewer.firstName} {reviewer.lastName} ({reviewer.affiliation})
                                                    </label>
                                                    <input
                                                        type="checkbox"
                                                        name="check-author"
                                                        id={reviewer._id}
                                                        className="bg-none check-author-inp"
                                                        onChange={handleSelectReviewer}
                                                    />
                                                </li>
                                            </label>
                                        ))}
                                    </ul>
                                </div>
                                <input
                                    type="button"
                                    value="Submit"
                                    className="btn btn-dark my-2 mx-2"
                                    id="submit"
                                    // name="add user"
                                    onClick={() => selectedReviewers.length > 0 ? setRcnfModalShow(true) : toast.error("Please select at least one reviewer")}
                                />

                                <Confirmation
                                    show={rcnfModalShow}
                                    handleClose={() => setRcnfModalShow(false)}
                                    onConfirm={handleSubmitReviewer}
                                    title="Assign Reviewer"
                                    message={`<p><strong class="text-capitalize d-block mb-2">Reviewers: ${selectedReviewers.length}</strong>Are you sure you want to assign the reviewers?</p>`}
                                />

                            </form>}
                        </div>}
                    </div>
                </div>
                {/* end editor-form here */}
            </div>
            {/* end container here */}
        </section>
    );
}

export default AssignReviewer;
