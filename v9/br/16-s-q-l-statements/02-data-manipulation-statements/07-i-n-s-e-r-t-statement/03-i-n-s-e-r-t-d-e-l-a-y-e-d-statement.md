#### 15.2.7.3 Declaração de INSERÇÃO ATÉ POSTO

```
INSERT DELAYED ...
```

A opção `DELAYED` para a declaração `INSERT` é uma extensão do MySQL para o SQL padrão. Em versões anteriores do MySQL, ela pode ser usada para certos tipos de tabelas (como `MyISAM`), de modo que, quando um cliente usa `INSERT DELAYED`, ele recebe uma confirmação do servidor de uma só vez, e a linha é colocada em fila para ser inserida quando a tabela não estiver sendo usada por nenhum outro thread.

As inserções e substituições `DELAYED` foram desaconselhadas no MySQL 5.6. No MySQL 9.5, `DELAYED` não é suportado. O servidor reconhece, mas ignora, a palavra-chave `DELAYED`, trata a inserção como uma inserção não retardada e gera uma mensagem de aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`: INSERÇÃO ATÉ POSTO não é mais suportada. A declaração foi convertida para INSERIR. A palavra-chave `DELAYED` está programada para ser removida em uma futura versão.