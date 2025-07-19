# gamification_logic.py
# Basic gamification and leaderboard logic for quiz application

import datetime


def update_streak(user, answered_correct):
    """
    Update the user's streak based on today's quiz result.

    Args:
        user (dict): {
            'user_id': str,
            'current_streak': int,
            'last_quiz_date': 'YYYY-MM-DD',
            'badges': [str],
            'total_points': int
        }
        answered_correct (bool): whether the user answered at least one question correctly today

    Returns:
        dict: updated user data
    """
    today = datetime.date.today().isoformat()
    yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()

    if not answered_correct:
        user['current_streak'] = 0
    else:
        if user.get('last_quiz_date') == yesterday:
            user['current_streak'] += 1
        else:
            user['current_streak'] = 1

    user['last_quiz_date'] = today
    return user


def check_badges(user):
    """
    Check and unlock new badges based on current streak milestones.

    Args:
        user (dict): contains 'current_streak' (int) and 'badges' (list)

    Returns:
        list: newly unlocked badge names
    """
    badges = set(user.get('badges', []))
    new_badges = []
    milestones = {3: '3-Day Streak', 7: '7-Day Streak', 30: '30-Day Streak'}
    streak = user.get('current_streak', 0)

    for days, badge_name in milestones.items():
        if streak >= days and badge_name not in badges:
            badges.add(badge_name)
            new_badges.append(badge_name)

    user['badges'] = list(badges)
    return new_badges



def generate_encouragement(score, max_score=5):
    """
    Generate an encouragement message based on performance.

    Args:
        score (int): user's score
        max_score (int): total possible points

    Returns:
        str: encouragement message
    """
    ratio = score / max_score
    if ratio == 1.0:
        return "Perfect score! You're a trivia master!"
    elif ratio >= 0.8:
        return "Great job! Keep up the streak!"
    elif ratio >= 0.5:
        return "Nice work! A little more practice and you'll ace it!"
    else:
        return "Don't give up! Try again tomorrow for a better score!"


def update_leaderboard(leaderboard, user_id, points):
    """
    Update the leaderboard with points earned and sort it.

    Args:
        leaderboard (list of dict): each entry {'user_id': str, 'total_points': int}
        user_id (str): the user's identifier
        points (int): points to add

    Returns:
        list: updated and sorted leaderboard
    """
    found = False
    for entry in leaderboard:
        if entry['user_id'] == user_id:
            entry['total_points'] += points
            found = True
            break
    if not found:
        leaderboard.append({'user_id': user_id, 'total_points': points})

    leaderboard.sort(key=lambda e: e['total_points'], reverse=True)
    return leaderboard

# Example usage:
# user = {'user_id':'123', 'current_streak':2, 'last_quiz_date':'2025-07-17', 'badges':[], 'total_points':10}
# user = update_streak(user, answered_correct=True)\# user now has updated streak
# new_badges = check_badges(user)
# score = apply_golden_bonus(4, is_golden=True)
# msg = generate_encouragement(score)
# leaderboard = []
# leaderboard = update_leaderboard(leaderboard, user['user_id'], score)
