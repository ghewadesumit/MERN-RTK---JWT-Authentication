import { useDispatch } from 'react-redux';
import { deleteGoal } from '../features/goals/goalSlice';
import useAxiosPrivate from '../hook/useAxiosPrivate';
function GoalItem({ goal }) {
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	return (
		<div className='goal'>
			<div>{new Date(goal.createdAt).toLocaleString('en-US')}</div>
			<h2>{goal.text}</h2>
			<button
				onClick={() => dispatch(deleteGoal({ axiosPrivate, id: goal._id }))}
				className='close'>
				X
			</button>
		</div>
	);
}

export default GoalItem;
