### 15.1.9 Declaração `ALTER PROCEDURE`

```
ALTER PROCEDURE proc_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE {SQL | JAVASCRIPT}
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
  | USING([library_reference][, library_reference][, ...])
}
```

Esta declaração pode ser usada para alterar as características de um procedimento armazenado. Mais de uma alteração pode ser especificada em uma declaração `ALTER PROCEDURE`. No entanto, você não pode alterar os parâmetros ou o corpo de um procedimento armazenado usando esta declaração; para fazer tais alterações, você deve descartar e recriar o procedimento usando `DROP PROCEDURE` e `CREATE PROCEDURE`.

Você deve ter o privilégio `ALTER ROUTINE` para o procedimento. Por padrão, esse privilégio é concedido automaticamente ao criador do procedimento. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges`. Veja a Seção 27.2.2, “Procedimentos Armazenados e Privilégios MySQL”.

A cláusula `USING` é específica para programas armazenados escritos em JavaScript (veja a Seção 27.3, “Programas Armazenados em JavaScript”), e permite que você especifique uma lista de zero ou mais bibliotecas a serem importadas pelo procedimento armazenado, causando a remoção de qualquer lista anterior (assim como faz com `ALTER FUNCTION`). Os resultados possíveis são listados aqui:

* *Uma cláusula `USING` é empregada, e lista uma ou mais bibliotecas*: Após a execução da declaração `ALTER PROCEDURE`, o procedimento importa apenas as bibliotecas listadas na declaração `ALTER FUNCTION`; quaisquer bibliotecas listadas anteriormente são removidas da lista e não mais importadas.

* *A declaração inclui uma cláusula `USING` vazia*: Todas as bibliotecas importadas anteriormente são removidas da lista; a função não importa mais nenhuma biblioteca.

* *`USING` não é usado*: Nenhuma alteração é feita na lista de bibliotecas especificada quando o procedimento foi criado.

Exemplos:

* `ALTER PROCEDURE myproc USING(lib1, lib2);`

(`USING` com uma lista não vazia:) Após a execução, `myproc` importa *apenas* as bibliotecas `lib1` e `lib2`, e nenhuma outra biblioteca.

* `ALTER PROCEDURE myproc USING();`

  (`USING` com uma lista vazia:) Após a execução, `myproc` não importa mais nenhuma biblioteca.

* `ALTER PROCEDURE myproc COMMENT "Este procedimento foi alterado";`

  (Sem cláusula `USING`:) O procedimento continua importando as mesmas bibliotecas que fazia antes de isso ser emitido.