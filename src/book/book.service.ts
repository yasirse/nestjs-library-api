import { Injectable, NotFoundException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>,
      ){}
      async findAll(query:Query): Promise<Book[]> {
        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        const keyword = query.keyword?{title: {$regex: query.keyword,
              $options: 'm',
            },
          }
        : {};
        const books = await this.bookModel.find({...keyword}).limit(resPerPage).skip(skip);
        return books;
      }
      async create(book: Book): Promise<Book> {
        const res = await this.bookModel.create(book);
        return res;
      }

      // async findById(id: string): Promise<Book>
      // {
      //   const book=await this.bookModel.findById(id);
      //   return book ;
      // }
      async findById(id: string): Promise<Book> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
          throw new BadRequestException('Please enter correct id.');
        }
        const book = await this.bookModel.findById(id);
            
          if (!book) {
            throw new NotFoundException('Book not found.');
          }    
        return book;
      }

      async updateById(id: string,book:Book): Promise<Book> {
        const book1 = await this.bookModel.findByIdAndUpdate(id,book,{
          new:true,
          runValidators:true,
        });
    
        if (!book1) {
          throw new NotFoundException('Book not found.');
        }    
        return book1;
      }

      async deleteById(id:string):Promise<Book>
      {
        const book=await this.bookModel.findByIdAndDelete(id)
        return book;
      }
}
