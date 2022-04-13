// DATABASE CREATION QUERIES
const createDatabaseDev = "CREATE DATABASE IF NOT EXISTS rumsl_local";

const createDatabaseProd = "CREATE DATABASE IF NOT EXISTS rum_services_locator";

// TABLE CREATION QUERIES
const createOfficeTable = 
`
CREATE TABLE IF NOT EXISTS Office (
    office_id INT NOT NULL AUTO_INCREMENT,
    building_id INT NOT NULL,
    office_name VARCHAR(255) NOT NULL UNIQUE,
    office_description MEDIUMTEXT NOT NULL,
    office_schedule MEDIUMTEXT NOT NULL,
    office_latitude DOUBLE NOT NULL,
    office_longitude DOUBLE NOT NULL,
    office_floor_number TINYTEXT,
    office_room_code TINYTEXT,
    office_email TINYTEXT,
    office_phone_number TINYTEXT,
    office_extension_number TINYTEXT,
    office_website MEDIUMTEXT,
    office_active_status BOOL,
    PRIMARY KEY(office_id),
    FOREIGN KEY (building_id) REFERENCES building(building_id)
)
`
;

const createBuildingTable = 
`
CREATE TABLE IF NOT EXISTS Building (
    building_id INT NOT NULL AUTO_INCREMENT,
    building_name VARCHAR(255) NOT NULL UNIQUE,
    building_latitude DOUBLE NOT NULL,
    building_longitude DOUBLE NOT NULL,
    PRIMARY KEY(building_id)
)
`
;

const createAdminTable = 
`
CREATE TABLE IF NOT EXISTS Administrator (
    admin_id INT NOT NULL AUTO_INCREMENT,
    admin_email VARCHAR(255) NOT NULL UNIQUE,
    admin_password TINYTEXT NOT NULL,
    admin_name TINYTEXT NOT NULL,
    admin_last_name TINYTEXT NOT NULL,
    admin_active_status BOOL NOT NULL,
    reset_passw_token TINYTEXT,
    reset_passw_expires DATETIME,
    PRIMARY KEY(admin_id)
)
`
;

const createPendingAdminTable = 
`
CREATE TABLE IF NOT EXISTS Pending_Admin (
    pending_admin_id INT NOT NULL AUTO_INCREMENT,
    admin_id INT NOT NULL,
    pending_email VARCHAR(255) NOT NULL UNIQUE,
    pending_status bool NOT NULL,
    PRIMARY KEY(pending_admin_id),
    FOREIGN KEY(admin_id) REFERENCES administrator(admin_id)
)
`
;

const createOfficeRecordsTable = 
`
CREATE TABLE IF NOT EXISTS Office_Record_Updates (
    update_office_id INT NOT NULL AUTO_INCREMENT,
    office_id INT NOT NULL,
    admin_id INT NOT NULL,
    update_datetime DATETIME NOT NULL,
    update_justification MEDIUMTEXT NOT NULL,
    PRIMARY KEY(update_office_id),
    FOREIGN KEY(office_id) REFERENCES office(office_id),
    FOREIGN KEY (admin_id) REFERENCES administrator(admin_id)
)
`
;

const createAdminRecordsTable = 
`
CREATE TABLE IF NOT EXISTS Admin_Record_Updates (
    update_admin_id INT NOT NULL AUTO_INCREMENT,
    editor_admin_id INT NOT NULL,
    updated_admin_id INT NOT NULL,
    update_justification MEDIUMTEXT NOT NULL,
    update_datetime DATETIME NOT NULL,
    PRIMARY KEY(update_admin_id),
    FOREIGN KEY(editor_admin_id) REFERENCES administrator(admin_id),
    FOREIGN KEY (update_admin_id) REFERENCES administrator(admin_id)
)
`
;

// DATABASE POPULATION QUERIES
const populateBuildings = 
`
INSERT INTO Building (building_name, building_latitude, building_longitude)
VALUES 
    ("Centro de Estudiantes", 18.2101382977879, -67.14119361),
    ('Celis', 18.209394441546, -67.1409277),
    ('Vagon de Transito', 18.2131670832037, -67.1421152),
    ('Vagon de Guardia', 18.2132536705792, -67.141885),
    ('Administracion de Empresas', 18.2175795219455, -67.1420406978991),
    ('Decanato de Estudiantes', 18.208729, -67.141259),
    ('Servicios Medicos', 18.210543, -67.14219),
    ('Terrats', 18.210467, -67.139199)
`
;

const populateOffices = 
`
INSERT INTO Office (building_id, office_name, office_description, office_schedule, office_latitude, office_longitude, office_floor_number, office_room_code, office_email, office_phone_number, office_extension_number, office_website, office_active_status)
VALUES
    (1, 'Cafeteria', 'Comida Criolla', 'L-J 7:00AM - 8:00PM V 7:00AM - 6:00PM', 18.2101991, -67.1411841, 2, 'CE-200', null, null, null, null, 1),
    (1, 'Actividades Sociales y Culturales','Departamento responsable del reconocimiento de todas las organizaciones estudiantiles del RUM y de ofrecer un programa de actividades sociales y culturales.','L-V 7:45AM - 4:30PM', 18.2101991, -67.1411841, 3, 'CE-306', 'actividadessociales@uprm.edu', '(787) 832-4040', 'Ext. 3366, 3370', 'https://www.uprm.edu/p/actividades-sociales/portada',1),
    (1, 'Oficina de ID de Estudiantes', 'Oficina responsable de la creacion y distribucion de la tarjeta de identificacion del recinto.', 'L-V 8:30AM - 3:30PM', 18.2101383, -67.14119361, 4, 'CE-409', null, null, null, 'https://www.uprm.edu/news/events/e20046-I00025056004135.html', 1),
    (1, 'Colocaciones', 'Oficina responsable de proveerle a los estudiantes, recien graduados y alumnos las herramientas necesarias que los pueden ayudar a alcanzar una busqueda de trabajo efectiva.', 'L-V 7:30AM - 4:30PM', 18.2101548, -67.1412475, 5, 'CE-508', 'placement@uprm.edu', '(787) 832-4040', 'Ext. 2070, 2074, 3691, 3898, 3858', 'https://dev.uprm.edu/placement/home', 1),
    (5, 'Consejeria y Servicios Psicologicos', 'Unidad de apoyo al estudiante enfocada en la formacion integral de la vida estudiantil.', 'L-V 7:30AM - 4:30PM', 18.21757952, -67.1420407, 2, 'AE-212', 'dcsp@uprm.edu', '(787) 265-3864', null, 'https://www.uprm.edu/dcsp/', 1),
    (1, 'Merendero', 'Comida Rapida', 'L-V 6:00AM - 3:00PM', 18.21013586, -67.1410805, 1, 'CE-107', null, null, null, null, 1),
    (1, 'Libreria', 'Libreria responsable de tener disponible los textos de clases, libros de interes general y materiales educativos requeridos para el desarollo academico e intelectual del estudiantado, del personal docente y administrativo del recinto.', 'L-V 7:30AM - 3:30PM', 18.2102338, -67.1411546, 1, 'CE-105', null, '(787) 834-8290', null, 'https://www.uprm.edu/p/trolley/libreria_colegial', 1),
    (1, 'Oficina de Intercambios', 'Oficina que tiene como proposito brindar a los estudiantes un vehiculo a traves del cual pueden desarrollarse academica, social y culturalmente en un ambiente universitario diferente.', 'L-V 7:45AM - 4:30PM', 18.2102389, -67.1413283, 4, 'CE-409', 'intercambio@uprm.edu', '(787) 265-3896', null, 'https://www.uprm.edu/intercambio/', 1),
    (2, 'Registraduria', 'Oficina a cargo de custodiar la informacion y gerenciar los procesos que permiten a los estudiantes avanzar en su programa academico.', 'L-V 7:45AM - 4:30PM', 18.20936503, -67.14112622, 2, 'C-203-B', 'registro@uprm.edu', '(787) 832-4040','Ext. 3813, 5717', 'https://www.uprm.edu/registraduria/', 1),
    (2, 'CTI', 'Oficina a cargo de proveer infraestructura para mejorar el acceso a la informacion para toda la comunidad universitaria y proveer la tecnologia para apoyar el proceso de eseñanza y aprendizaje, utilizando nuevas estrategias que nos permitan atemperar y apoyar nuestros objetivos academicos institucionales.', 'L-V 7:45AM - 4:30PM', 18.2093694, -67.1408029, 0, 'C-010', 'computacion@uprm.edu', '(787) 832-4040', 'Ext. 2009, 2051, 2055', 'https://www.uprm.edu/cti/', 1),
    (2, 'Procuradora Estudiantil','Oficina a cargo de proveer un mecanismo informal efectivo para facilitar el apoderamiento de los miembros de la comunidad universitaria del Recinto Universitario de Mayagüez en el proceso de solucion de situaciones relacionadas con estudiantes.', '7:45AM - 4:30PM', 18.2095802, -67.141104, 3, 'C-324', 'procuraduria@uprm.edu', '(787) 832-4040', 'Ext. 3588, 5462', 'https://www.uprm.edu/procuraduria', 1),
    (2, 'Estudios Graduados ', 'Oficina responsable de informar a la comunidad academica sobre las regulaciones sobre estudios graduados en el recinto y eventos importantes relacionados a ellos. La oficina coordina y organiza el proceso de adminsion y matricula para estudiantes graduados nuevos, estudiantes de desarrollo profesional y estudiantes de intercambio.', '7:45AM - 4:30PM', 18.2093267, -67.1407761, 1, 'C-111', 'egraduados.uprm@upr.edu', '(787) 832-4040', 'Ext. 3809, 3598, 3442', 'https://www.uprm.edu/oeg/', 1),
    (2, 'Oficina de Admisiones', 'Oficina con el proposito fundamental de brindarle un servicio de excelencia a estudiantes interesados en ser admitidos al campus universitario en el genuino interes en orientar y guiar a estudiantes durante el proceso de solicitud de admision.', '7:45AM - 4:30PM', 18.2094035, -67.1411389, 1, 'C-101', 'admisiones@uprm.edu', '(787) 832-4040', 'Ext. 3811, 2404, 2414', 'https://www.uprm.edu/admisiones/', 1),
    (2, 'Centro de Redaccion Bilingüe (CIVIS)', 'Oficina con la mision de hacer hincapie en el desarollo de la escritura como habilidad profesional integral.', '8:00AM - 4:00PM', 18.209379, -67.1407201, 2, 'C-208', 'civis@uprm.edu', '(787) 832-4040', 'Ext. 3807, 3808', 'https://www.uprm.edu/civis/', 1),
    (2, 'RumboEX', 'El centro ofrece asesorias gratuitas y sin cita para diversas materias.', '"L - J: 8:00AM - 10:00PM V: 8:00AM - 4:30PM', 18.2094888, -67.1406993, 0, 'C-011', 'rumboex@uprm.edu', '(787) 832-4040', 'Ext. 6417', 'https://www.uprm.edu/rumboex1/', 1),
    (6, 'Asistencia Economica', 'Oficina a cargo de orientar al estudiante sobre las normas y regulaciones federales de las distintas ayudas economicas disponibles, procedimientos para solicitarlas y requisitos de elegibilidad.', '7:45AM - 4:30PM', 18.20884819, -67.14116502, 1, null, 'aeconomica@uprm.edu', '(787) 832-4040', 'Ext. 3863, 3440', 'https://www.uprm.edu/asistenciaeconomica/', 1),
    (7, 'Servicios Medicos', 'Departamento a cargo de ofrecer servicios de salud de calidad a traves de programas educativos, de prevencion, de evaluacion y de tratamiento; dirigidos a promover una mejor salud fisica y social entre la comunidad universitaria.', '7:30AM - 4:30PM', 18.21048912, -67.14220612, 1, null, 'servmed@uprm.edu', '(787) 832-4040', 'Ext. 3408, 3416', 'https://www.uprm.edu/serviciosmedicos/', 1),
    (3, 'Transito y Vigilancia', 'Oficina a cargo de vigilar las instalaciones de estacionamiento tomando en cuenta el mejor uso de las mismas y aread disponibles, armorizando toda gestion encaminada a estos propositos con la conservacion de nuestros recursos naturales.', '7:45AM - 4:30PM', 18.21316708, -67.1421153, 1, null, 'transito@uprm.edu', '(787) 832-4040', 'Ext. 3275, 3597', 'https://www.uprm.edu/transitoyvigilancia/', 1),
    (4, 'Guardia Universitaria', 'Oficina a cargo de mantener el orden y la tranquilidad institucional garantizando la proteccion de la vida y propiedad de todos los componentes de la comunidad universitaria y visitantes mediante la orientacion y aplicacion estricta de la reglamentacion que rige los trabajos academicos y administrativos de la Universidad de Puerto Rico.', '24 horas', 18.21325367, -67.14188572, 1, null, 'transito@uprm.edu', '(787) 832-4040', 'Ext. 3263, 3620', 'https://www.uprm.edu/transitoyvigilancia/', 1),
    (8, 'Oficina de Recaudaciones', 'Oficina responsable de recibir y depositar las recaudaciones de fondos que surgen de las actividades de la institucion.', '7:45AM - 4:30PM', 18.21040843, -67.13904782, 1, 'T-108', 'recaudaciones@uprm.edu', '(787) 832-4040', 'Ext. 5484, 2489', 'https://www.uprm.edu/finanzas/recaudaciones/', 1)
`
;

// DATABASE DROP QUERIES
const dropDatabaseDev = "DROP DATABASE IF EXISTS rumsl_local";
const dropDatabaseProd = "DROP DATABASE IF EXISTS rum_services_locator";

// TABLE DROP QUERIES
const dropBuildingTable = "DROP TABLE IF EXISTS Building;";
const dropOfficeTable = "DROP TABLE IF EXISTS Office;";
const dropAdminTable = "DROP TABLE IF EXISTS Administrator;";
const dropPendingAdminTable = "DROP TABLE IF EXISTS Pending_Admin;";
const dropOfficeUpdateTable = "DROP TABLE IF EXISTS Office_Record_Updates;";
const dropAdminUpdateTable = "DROP TABLE IF EXISTS Admin_Record_Updates;";

module.exports = {
    createDatabaseDev,
    createDatabaseProd,
    createOfficeTable,
    createBuildingTable,
    createAdminTable,
    createPendingAdminTable,
    createOfficeRecordsTable,
    createAdminRecordsTable,
    populateBuildings,
    populateOffices,
    dropDatabaseDev,
    dropDatabaseProd,
    dropBuildingTable,
    dropOfficeTable,
    dropAdminTable,
    dropPendingAdminTable,
    dropOfficeUpdateTable,
    dropAdminUpdateTable,
}