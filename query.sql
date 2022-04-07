UPDATE db.inventory
SET project_id = 1016
WHERE project_id in (1060, 1752);

UPDATE db.inventory_log
SET project_id = 1016
WHERE project_id in (1060, 1752);

UPDATE db.project_timesheet
SET project_id = 1016
WHERE project_id in (1060, 1752);

UPDATE db.project_inventory_no_track
SET project_id = 1016
WHERE project_id in (1060, 1752);

UPDATE db.inventory_track
SET project_id = 1016
WHERE project_id in (1060, 1752);

DELETE from db.inventory_container
WHERE project_id in (1060, 1752);

DELETE from db.project
WHERE id in (1060, 1752);