
#https://realpython.com/python-mysql/

from getpass import getpass
from mysql.connector import connect, Error

def confirm(prompt=None, resp=False):
    """prompts for yes or no response from the user. Returns True for yes and
    False for no.
    'resp' should be set to the default value assumed by the caller when
    user simply types ENTER.
    >>> confirm(prompt='Create Directory?', resp=True)
    Create Directory? [y]|n: 
    True
    >>> confirm(prompt='Create Directory?', resp=False)
    Create Directory? [n]|y: 
    False
    >>> confirm(prompt='Create Directory?', resp=False)
    Create Directory? [n]|y: y
    True
    """
    
    if prompt is None:
        prompt = 'Confirm'
    if resp:
        prompt = '%s [%s]|%s: ' % (prompt, 'y', 'n')
    else:
        prompt = '%s [%s]|%s: ' % (prompt, 'n', 'y')
    while True:
        ans = input(prompt)
        if not ans:
            return resp
        if ans not in ['y', 'Y', 'n', 'N']:
            print ('Please enter y or n.')
            continue
        if ans == 'y' or ans == 'Y':
            return True
        if ans == 'n' or ans == 'N':
            return False

def projectMerge(connection, deleteProject, keepProject):

    sql_query = f'''
    UPDATE inventory
    SET project_id = '{keepProject}'
    WHERE project_id = '{deleteProject}'

    UPDATE inventory_log
    SET project_id = '{keepProject}'
    WHERE project_id = '{deleteProject}'

    UPDATE project_timesheet
    SET project_id = '{keepProject}'
    WHERE project_id = '{deleteProject}'

    UPDATE project_inventory_no_track
    SET project_id = '{keepProject}'
    WHERE project_id = '{deleteProject}'

    UPDATE inventory_track
    SET project_id = '{keepProject}'
    WHERE project_id = '{deleteProject}'

    DELETE from inventory_container
    WHERE project_id = '{deleteProject}'

    DELETE from project
    WHERE id = '{deleteProject}'
    '''
    print(sql_query)

    #with connection.cursor() as cursor:
        #cursor.execute(sql_query)
        #connection.commit()

try:
    with connect(
        #host="35.227.47.109", #live
        host="35.231.110.14", #clone
        #user=input("Enter username: "),
        user="sam_myers",
        #password=getpass("Enter password: "),
        password="8312",
        database="db",
    ) as connection:
        deleteProject=input("Enter the project ID to MERGE (delete): "),
        keepProject=input("Enter the project ID to KEEP: "),
        print(connection)
        #run the merge function
        input(f'Deleting project ID {deleteProject[0]} and merging into {keepProject[0]} CTRL-C to cancel')
        projectMerge(connection, deleteProject[0], keepProject[0])
       
except Error as e:
    print(e)