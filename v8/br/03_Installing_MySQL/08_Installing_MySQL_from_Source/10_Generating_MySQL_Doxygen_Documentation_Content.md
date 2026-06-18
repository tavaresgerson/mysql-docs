### 2.8.10 Gerando conteúdo de documentação Doxygen do MySQL

O código-fonte do MySQL contém documentação interna escrita usando o Doxygen. O conteúdo gerado pelo Doxygen está disponível em <https://dev.mysql.com/doc/index-other.html>. É também possível gerar esse conteúdo localmente a partir de uma distribuição de código-fonte do MySQL usando o seguinte procedimento:

1. Instale o **doxygen** 1.9.2 ou uma versão posterior. As distribuições estão disponíveis aqui em <http://www.doxygen.nl/>.

   Após instalar o **doxygen**, verifique o número da versão:

   ```
   $> doxygen --version
   1.9.2
   ```

2. Instale o PlantUML.

   Quando você instala o PlantUML no Windows (testado no Windows 10), você deve executá-lo pelo menos uma vez como administrador para que ele crie as chaves do registro. Abra um console de administrador e execute o seguinte comando:

   ```
   $> java -jar path-to-plantuml.jar
   ```

   O comando deve abrir uma janela de interface gráfica e não retornar erros no console.

3. Defina o `PLANTUML_JAR_PATH` do ambiente para o local onde instalou o PlantUML. Por exemplo:

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

5. Altere a localização para o diretório de nível superior da sua distribuição de origem do MySQL e faça o seguinte:

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

   Inspecione o log de erros, que está disponível no arquivo `doxyerror.log` no diretório de nível superior. Supondo que a compilação tenha sido executada com sucesso, visualize a saída gerada usando um navegador. Por exemplo:

   ```
   $> firefox doxygen/html/index.html
   ```
