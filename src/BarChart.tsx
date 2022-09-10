
import React, { ChangeEvent, useEffect, useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';
import { ComputedDatum, ResponsiveBar } from '@nivo/bar';
import axios from 'axios';
import {baseUrl, chartDataEndpoint, commentsEndpoint} from './constants/urlConstants';
import './assets/css/App.css';
import * as chartConfig from './config/chartConfig';
import { IAllComments, IDataPoint } from './types';

const initializeNewComment = () => ({ message: '', username: '' });

function BarChart() {
    const [openPanel, setOpenPanel] = useState(false);
    const [selectedDataPoint, setSelectedDataPoint] = useState < IDataPoint | ComputedDatum < never >> ({});
    const [comments, setComments] = useState([]);
    const [allComments, setAllComments] = useState < IAllComments > ({});
    const [chartData, setChartData] = useState([]);
    const [chartKeys, setChartKeys] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [newComment, setNewComment] = useState(initializeNewComment());

    const { id: industry = '', indexValue: year = '' } = selectedDataPoint;
    const commentsSectionTitle = `${industry} in the year ${year}`;

    const showErrorMessage = () => {
        setErrorMessage(`Could not fetch chart-data, make sure the backend is running on ${baseUrl}`)
    }

    const fetchChartData = async () => {
        const res = await axios(chartDataEndpoint).catch(showErrorMessage);

        if (res?.status === 200) {
            const { chart_data, industries } = res.data;
            setChartData(chart_data);
            setChartKeys(industries);
            setErrorMessage('')
        }
    };

    const fetchComments = async () => {
        const res = await axios(commentsEndpoint).catch(showErrorMessage);

        if (res?.status === 200) {
            setAllComments(res.data);
            setErrorMessage('')
        }
    };

    useEffect(() => {
        fetchChartData();
        fetchComments();
    }, []);

    useEffect(() => {
        const allCommentsInSelectedIndustry = allComments[industry] || {};
        const commentsForSelectedYear = allCommentsInSelectedIndustry[year] || [];

        setComments(commentsForSelectedYear);
    }, [selectedDataPoint, allComments, industry, year]);

    const updateComment = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target || {};
        const updatedComment = { ...newComment, [name]: value };
        setNewComment(updatedComment);
    };

    const showCommentsPanel = (e: IDataPoint | ComputedDatum<never>) => {
        setSelectedDataPoint(e);
        setOpenPanel(true);
    };

    const postNewComment = async () => {
        const res = await axios.post(commentsEndpoint, { ...newComment, industry, year });

        if (res.status === 201) {
            const updatedComments = {
                [industry]: {
                    [year]: [...comments, newComment],
                },
            };

            setAllComments({ ...allComments, ...updatedComments }); // show the new comment in UI
            setNewComment(initializeNewComment()); // reset form inputs
        }
    };

    const getCommentsCount = (d: ComputedDatum<never>) => {
        const { id: industry = '', indexValue: year = '' } = d;
        const commentsForTheIndustry = allComments[industry] || {};
        const commentsForTheYear = commentsForTheIndustry[year] || [];
        return commentsForTheYear.length;
    };

    return (
        <>
            <div className="chart-container">
                {errorMessage && <p>{errorMessage}</p>}
                {
                    chartData.length > 0
                    && <ResponsiveBar
                        data={chartData}
                        keys={chartKeys}
                        indexBy="Year"
                        animate={false}
                        margin={chartConfig.margin}
                        padding={0.3}
                        groupMode="grouped"
                        valueScale={chartConfig.valueScale}
                        indexScale={chartConfig.indexScale}
                        colors={chartConfig.colors}
                        defs={chartConfig.decorationPatterns}
                        fill={chartConfig.fill}
                        borderColor={chartConfig.borderColor}
                        axisBottom={chartConfig.axisBottom}
                        axisLeft={chartConfig.axisLeft}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={chartConfig.labelTextColor}
                        legends={chartConfig.legend}
                        role="application"
                        ariaLabel="Nivo bar chart demo"
                        barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
                        onClick={showCommentsPanel}
                        label={getCommentsCount}
                    />
                }
            </div>
            <SlidingPanel
                panelContainerClassName="side-panel-container"
                type="right"
                isOpen={openPanel}
                backdropClicked={() => setOpenPanel(false)}
                size={30}
                noBackdrop
            >
                <div className="comments-container">
                    <p className="comments-title">{commentsSectionTitle}</p>
                    <ul className="comments-list">
                        {comments.length === 0 && <p className="post-a-comments-text">Be the first to post a comment</p>}
                        {
                            comments.map((comment: { id: string, username: string, message: string }) => (
                                <li key={comment.id} className="comment-item">
                                    <p className="comment-username">{comment.username}</p>
                                    <p className="comment-message">{comment.message}</p>
                                </li>
                            ))
                        }
                    </ul>
                    <div className="comments-form">
                        <input
                            onChange={updateComment}
                            className="username-input"
                            type="text"
                            placeholder="Username"
                            value={newComment.username}
                            name="username"
                        />
                        <textarea
                            onChange={updateComment}
                            rows={4}
                            placeholder="Comment"
                            className="comment-input-textarea"
                            value={newComment.message}
                            name="message"
                        />
                        <button
                            onClick={postNewComment}
                            className="submit-button"
                            type="submit"
                        >
                            Post comment
                        </button>
                    </div>
                </div>
            </SlidingPanel>
        </>
    );
}

export default BarChart;
