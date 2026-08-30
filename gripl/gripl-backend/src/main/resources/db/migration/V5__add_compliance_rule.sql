CREATE TYPE compliance_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TYPE compliance_violation_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TYPE compliance_concept_category AS ENUM ('PERSONAL_DATA', 'SENSITIVE_DATA', 'CONSENT', 'LEGAL_BASIS', 'CUSTOMER');

CREATE TYPE compliance_perspective AS ENUM ('PERSONAL_DATA', 'SENSITIVE_DATA', 'CONSENT', 'LEGAL_BASIS', 'CUSTOMER', 'EMPLOYEE', 'APPROVAL', 'PROCESSOR', 'CONTROLLER', 'ENCRYPTION', 'RETENTION_PERIOD');

CREATE TABLE regulation (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    version VARCHAR(255) NOT NULL,
    authority VARCHAR(255) NOT NULL
);

CREATE TABLE compliance_concept (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    category compliance_concept_category NOT NULL
);

CREATE TABLE compliance_rule (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    severity compliance_severity NOT NULL,
    regulation_id serial NOT NULL REFERENCES regulation(id)
);

CREATE TABLE "constraint" (
    id SERIAL PRIMARY KEY NOT NULL,
    perspective compliance_perspective,
    predicate VARCHAR(255) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    condition VARCHAR(255) NOT NULL,
    left_operand_id serial NOT NULL REFERENCES compliance_concept(id),
    right_operand_id serial NOT NULL REFERENCES compliance_concept(id),
    compliance_rule_id serial NOT NULL REFERENCES compliance_rule(id)
);

CREATE TABLE "exception" (
    id SERIAL PRIMARY KEY NOT NULL,
    condition VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    compliance_rule_id serial NOT NULL REFERENCES compliance_rule(id)
);

CREATE TABLE violation (
    id SERIAL PRIMARY KEY NOT NULL,
    severity compliance_violation_severity NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(255),
    recommendation VARCHAR(255),
    compliance_rule_id serial NOT NULL REFERENCES compliance_rule(id)
);

