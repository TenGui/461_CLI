-- CREATE DATABASE IF NOT EXISTS mydb;
-- USE mydb;

-- Create PackageMetadata table
CREATE TABLE PackageMetadata (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Version VARCHAR(20) NOT NULL,
    UNIQUE (Name, Version)
);

-- Create PackageData table
CREATE TABLE PackageData (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Content LONGTEXT,
    URL VARCHAR(255),
    JSProgram LONGTEXT
);

-- Create Package table with foreign keys to PackageMetadata and PackageData
CREATE TABLE Package (
    PackageID INT AUTO_INCREMENT PRIMARY KEY,
    MetadataID INT,
    DataID INT,
    FOREIGN KEY (MetadataID) REFERENCES PackageMetadata (ID) ON DELETE CASCADE,
    FOREIGN KEY (DataID) REFERENCES PackageData (ID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Drop the existing procedure if it exists
DROP PROCEDURE IF EXISTS InsertPackage;

DELIMITER //
CREATE PROCEDURE InsertPackage(IN Name VARCHAR(255), IN Version VARCHAR(20), IN Content LONGTEXT, IN URL VARCHAR(255), IN JSProgram LONGTEXT, OUT response INT)
BEGIN
  DECLARE metadata_id INT;
  DECLARE data_id INT;
  DECLARE package_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    -- You can log the error or take other actions here if needed.
  END;

  START TRANSACTION;

  -- Insert data into PackageMetadata
  INSERT INTO PackageMetadata (Name, Version)
  VALUES (Name, Version);

  -- Retrieve the generated PackageMetadata ID
  SET metadata_id = LAST_INSERT_ID();

  -- Insert data into PackageData
  INSERT INTO PackageData (Content, JSProgram, URL)
  VALUES (Content, JSProgram, URL);

  -- Retrieve the generated PackageData ID
  SET data_id = LAST_INSERT_ID();

  -- If both INSERT statements were successful, insert data into Package
  INSERT INTO Package (MetadataID, DataID)
  VALUES (metadata_id, data_id);

  COMMIT;
END;
//
DELIMITER ;

-- Drop the existing procedure if it exists
DROP PROCEDURE IF EXISTS GetPackage;

DELIMITER //
CREATE PROCEDURE GetPackage(IN PackageID INT)
BEGIN
    -- DECLARE v_JSON JSON; -- Declare a variable to store the JSON object

    -- -- Select data and metadata and store them in the v_JSON variable
    -- SELECT 
    --     JSON_OBJECT(
    --         'metadata', JSON_OBJECT(
    --             'Name', pm.Name,
    --             'Version', pm.Version,
    --             'ID', pm.ID
    --         ),
    --         'data', JSON_OBJECT(
    --             'Content', pd.Content,
    --             'URL', CAST(pd.URL AS CHAR),
    --             'JSProgram', pd.JSProgram
    --         )
    --     )
    -- INTO v_JSON -- Store the JSON object in the variable
    -- FROM Package AS p
    -- JOIN PackageMetadata AS pm ON p.MetadataID = pm.ID
    -- JOIN PackageData AS pd ON p.DataID = pd.ID
    -- WHERE p.PackageID = PackageID;

    -- -- Select the JSON object from the variable to return it
    -- SELECT v_JSON;
    -- SELECT PM.*, PD.*
    -- FROM Package AS P
    -- JOIN PackageMetadata AS PM ON P.MetadataID = PM.ID
    -- JOIN PackageData AS PD ON P.DataID = PD.ID
    -- WHERE P.PackageID = PackageID;
    SELECT
        JSON_OBJECT(
            'metadata', JSON_OBJECT(
            'Name', PM.Name,
            'Version', PM.Version,
            'ID', PM.ID
            ),
            'data', JSON_OBJECT(
            'Content', PD.Content,
            'URL', PD.URL,
            'JSProgram', PD.JSProgram
            )
        ) as result
    FROM Package AS P
    JOIN PackageMetadata AS PM ON P.MetadataID = PM.ID
    JOIN PackageData AS PD ON P.DataID = PD.ID
    WHERE P.PackageID = PackageID;


END;
// 
DELIMITER ;

