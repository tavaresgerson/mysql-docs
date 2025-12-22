#### 7.6.7.5 Clonagem de dados encriptados

É suportada a clonagem de dados encriptados, sendo aplicáveis os seguintes requisitos:

- Uma conexão segura é necessária ao clonar dados remotos para garantir a transferência segura de chaves de tablespace não criptografadas pela rede. As chaves de tablespace são descodificadas no doador antes do transporte e recodificadas no destinatário usando a chave mestre do destinatário. Um erro é relatado se uma conexão criptografada não estiver disponível ou se a cláusula `REQUIRE NO SSL` for usada na instrução `CLONE INSTANCE`.
- Ao clonar dados para um diretório de dados local que usa um keyring gerenciado localmente, o mesmo keyring deve ser usado ao iniciar o servidor MySQL no diretório do clone.
- Ao clonar dados para um diretório de dados remoto (o diretório do destinatário) que usa um keyring gerenciado localmente, o keyring do destinatário deve ser usado ao iniciar o separador MySQL no diretório clonado.

::: info Note

As configurações das variáveis `innodb_redo_log_encrypt` e `innodb_undo_log_encrypt` não podem ser modificadas enquanto uma operação de clonagem estiver em andamento.

:::

Para obter informações sobre a funcionalidade de encriptação de dados, ver Secção 17.13, "Encriptação de dados em repouso do InnoDB".
