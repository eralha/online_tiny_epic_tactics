module.exports = {

    ultimasMsgs : 'WITH res AS (SELECT * FROM "mensagem" AS m INNER JOIN "utilizador" AS u ON (u.id::varchar = m.userid) ORDER BY data DESC LIMIT 10) SELECT * FROM res ORDER BY data ASC',
    insereMsg : 'INSERT INTO mensagem (grupoid, userid, texto, data) VALUES ($1, $2, $3, $4)',
    insereUser : 'INSERT INTO encuser (userid, publicuserid) VALUES ($1, $2)',
    insereMultipleMsg : 'INSERT INTO mensagem (grupoid, userid, texto, data) SELECT * FROM UNNEST ($1::varchar[], $2::varchar[], $3::text[], $4::bigint[])',
    insereMultipleMsg2: 'INSERT INTO encmensagem (receiverid, userid, texto, data) SELECT * FROM UNNEST ($1::text[], $2::text[], $3::text[], $4::bigint[])',
    userGroups : 'WITH ugs AS (SELECT * FROM utilizadorgrupo AS ug WHERE userid = $1) SELECT id, nome FROM grupo AS g INNER JOIN ugs ON (ugs.grupoid = g.id)'

}