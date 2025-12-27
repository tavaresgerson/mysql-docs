### 2.8.10 Gerando Conteúdo de Documentação do MySQL Doxygen

O código-fonte do MySQL contém documentação interna escrita usando o Doxygen. O conteúdo gerado pelo Doxygen está disponível em https://dev.mysql.com/doc/index-other.html. Também é possível gerar esse conteúdo localmente a partir de uma distribuição do MySQL usando o seguinte procedimento:

1. Instale **doxygen** 1.9.2 ou versão posterior. As distribuições estão disponíveis aqui em <http://www.doxygen.nl/>.

   Após instalar o **doxygen**, verifique o número de versão:

   ```
   $> doxygen --version
   1.9.2
   ```

2. Instale o PlantUML.

   Ao instalar o PlantUML no Windows (testado no Windows 10), você deve executá-lo pelo menos uma vez como administrador para que ele crie as chaves de registro. Abra uma console de administrador e execute o seguinte comando:

   ```
   $> java -jar path-to-plantuml.jar
   ```

   O comando deve abrir uma janela de GUI e não retornar erros na console.

3. Defina o caminho `PLANTUML_JAR_PATH` para o local onde você instalou o PlantUML. Por exemplo:

   ```
   $> export PLANTUML_JAR_PATH=path-to-plantuml.jar
   ```

4. Instale o comando **dot** do Graphviz.

   Após instalar o Graphviz, verifique a disponibilidade do **dot**. Por exemplo:

   ```
   $> which dot
   /usr/bin/dot

   $> dot -V
   dot - graphviz version 2.40.1 (20161225.0304)
   ```

5. Mude para o diretório de nível superior da sua distribuição do MySQL e faça o seguinte:

   Primeiro, execute o **cmake**:

   ```
   $> cd mysql-source-directory
   $> mkdir build
   $> cd build
   $> cmake ..
   ```

   Em seguida, gere a documentação do **doxygen**:

   ```
   $> make doxygen
   ```

   Verifique o log de erro, que está disponível no arquivo `doxyerror.log` no diretório de nível superior. Supondo que a compilação tenha sido executada com sucesso, visualize a saída gerada usando um navegador. Por exemplo:

   ```
   $> firefox doxygen/html/index.html
   ```