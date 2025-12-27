#### 8.4.4.3 Transição para o Componente de Validação de Senha

Observação

No MySQL 9.5, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere-se que ele seja removido em uma versão futura do MySQL.

As instalações do MySQL que atualmente usam o plugin `validate_password` devem fazer a transição para o uso do componente `validate_password` em vez disso. Para fazer isso, use o procedimento a seguir. O procedimento instala o componente antes de desinstalar o plugin, para evitar uma janela de tempo durante a qual nenhuma validação de senha ocorre. (O componente e o plugin podem ser instalados simultaneamente. Nesse caso, o servidor tenta usar o componente, revertendo para o plugin se o componente estiver indisponível.)

1. Instale o componente `validate_password`:

   ```
   INSTALL COMPONENT 'file://component_validate_password';
   ```

2. Teste o componente `validate_password` para garantir que ele funcione conforme o esperado. Se você precisar definir quaisquer variáveis de sistema `validate_password.xxx`, pode fazê-lo em tempo de execução usando `SET GLOBAL`. (Quaisquer alterações no arquivo de opções que devem ser feitas são realizadas no próximo passo.)

3. Ajuste quaisquer referências ao sistema de plugin e variáveis de status para se referirem às variáveis de sistema e status correspondentes do componente. Suponha que você tenha configurado o plugin no início usando um arquivo de opções assim:

   ```
   [mysqld]
   validate-password=FORCE_PLUS_PERMANENT
   validate_password_dictionary_file=/usr/share/dict/words
   validate_password_length=10
   validate_password_number_count=2
   ```

   Essas configurações são apropriadas para o plugin, mas devem ser modificadas para se aplicarem ao componente. Para ajustar o arquivo de opções, omita a opção `--validate-password` (ela se aplica apenas ao plugin, não ao componente) e modifique as referências das variáveis de sistema de nomes sem ponto apropriados para o plugin para nomes com ponto apropriados para o componente:

   ```
   [mysqld]
   validate_password.dictionary_file=/usr/share/dict/words
   validate_password.length=10
   validate_password.number_count=2
   ```

Ajustes semelhantes são necessários para aplicações que fazem referência ao sistema de plugins `validate_password` e às variáveis de status durante a execução. Altere os nomes das variáveis de plugins sem ponto para os nomes correspondentes das variáveis de componentes com ponto.

4. Desinstale o plugin `validate_password`:

   ```
   UNINSTALL PLUGIN validate_password;
   ```

   Se o plugin `validate_password` for carregado no início do servidor usando uma opção `--plugin-load` ou `--plugin-load-add`, omita essa opção do procedimento de inicialização do servidor. Por exemplo, se a opção estiver listada em um arquivo de opções do servidor, remova-a do arquivo.

5. Reinicie o servidor.