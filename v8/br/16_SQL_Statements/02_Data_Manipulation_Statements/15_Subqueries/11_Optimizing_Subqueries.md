#### 15.2.15.11 Otimizando subconsultas

O desenvolvimento está em andamento, então nenhuma dica de otimização é confiável a longo prazo. A lista a seguir fornece alguns truques interessantes que você pode querer experimentar. Veja também a Seção 10.2.2, “Otimizando subconsultas, tabelas derivadas, referências de visualizações e expressões de tabela comuns”.

- Mude as cláusulas de fora para dentro da subconsulta. Por exemplo, use esta consulta:

  ```
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1 UNION ALL SELECT s1 FROM t2);
  ```

  Em vez dessa consulta:

  ```
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1) OR s1 IN (SELECT s1 FROM t2);
  ```

  Para outro exemplo, use esta consulta:

  ```
  SELECT (SELECT column1 + 5 FROM t1) FROM t2;
  ```

  Em vez dessa consulta:

  ```
  SELECT (SELECT column1 FROM t1) + 5 FROM t2;
  ```
